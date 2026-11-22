import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/types";

export interface TenantContext {
  userId: string;
  userFullName: string;
  userEmail: string;
  isSuperAdmin: boolean;
  centreId: string;
  centreName: string;
  centreSlug: string;
  role: Role;
  allMemberships: {
    centreId: string;
    centreName: string;
    centreSlug: string;
    role: Role;
  }[];
}

/**
 * Resolves current tenant context from authenticated session.
 * Enforces that user is legitimately a member of the centre.
 * NEVER trusts client-supplied centreId blindly.
 */
export async function getTenantContext(requestedCentreId?: string): Promise<TenantContext | null> {
  const session = await getSession();
  if (!session) return null;

  // Retrieve user with all active memberships
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      memberships: {
        where: { isActive: true },
        include: {
          centre: {
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) return null;

  const validMemberships = user.memberships.map((m) => ({
    centreId: m.centre.id,
    centreName: m.centre.name,
    centreSlug: m.centre.slug,
    role: m.role as Role,
  }));

  // If user is a Super Admin and wants to inspect a centre
  if (user.isSuperAdmin && requestedCentreId) {
    const targetCentre = await prisma.centre.findUnique({
      where: { id: requestedCentreId },
      select: { id: true, name: true, slug: true },
    });
    if (targetCentre) {
      return {
        userId: user.id,
        userFullName: user.fullName,
        userEmail: user.email,
        isSuperAdmin: true,
        centreId: targetCentre.id,
        centreName: targetCentre.name,
        centreSlug: targetCentre.slug,
        role: Role.SUPER_ADMIN,
        allMemberships: validMemberships,
      };
    }
  }

  // Resolve target membership
  let activeMembership = null;
  if (requestedCentreId) {
    activeMembership = user.memberships.find((m) => m.centreId === requestedCentreId);
  } else if (session.activeCentreId) {
    activeMembership = user.memberships.find((m) => m.centreId === session.activeCentreId);
  } else {
    // Default to primary or first membership
    activeMembership = user.memberships.find((m) => m.isPrimary) || user.memberships[0];
  }

  if (!activeMembership) {
    // If user is Super Admin with no centre membership yet, give them super admin context
    if (user.isSuperAdmin) {
      return {
        userId: user.id,
        userFullName: user.fullName,
        userEmail: user.email,
        isSuperAdmin: true,
        centreId: "",
        centreName: "Super Admin Console",
        centreSlug: "admin",
        role: Role.SUPER_ADMIN,
        allMemberships: [],
      };
    }
    return null;
  }

  return {
    userId: user.id,
    userFullName: user.fullName,
    userEmail: user.email,
    isSuperAdmin: user.isSuperAdmin,
    centreId: activeMembership.centre.id,
    centreName: activeMembership.centre.name,
    centreSlug: activeMembership.centre.slug,
    role: activeMembership.role as Role,
    allMemberships: validMemberships,
  };
}

/**
 * Role authorization check helpers
 */
export function isCentreAdmin(role: Role): boolean {
  return role === Role.SUPER_ADMIN || role === Role.CENTRE_OWNER || role === Role.CENTRE_MANAGER;
}

export function isStaff(role: Role): boolean {
  return isCentreAdmin(role) || role === Role.ACCOUNTANT || role === Role.TEACHER;
}
