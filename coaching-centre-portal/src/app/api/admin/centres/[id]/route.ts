import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const centre = await prisma.centre.findUnique({
      where: { id },
      include: {
        subscription: true,
        branches: true,
        classBatches: {
          include: {
            programme: true,
            _count: { select: { enrollments: true } },
          },
        },
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                isActive: true,
                createdAt: true,
              },
            },
          },
        },
        saasPayments: {
          orderBy: { createdAt: "desc" },
        },
        learningIntegrations: true,
        auditLogs: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { fullName: true, email: true } } },
        },
      },
    });

    if (!centre) {
      return NextResponse.json({ error: "Centre not found" }, { status: 404 });
    }

    // Owner record
    const ownerMembership = centre.memberships.find(
      (m) => m.role === "CENTRE_OWNER"
    );

    // Students count
    const studentCount = centre.memberships.filter((m) => m.role === "STUDENT").length;
    const staffCount = centre.memberships.filter((m) => m.role !== "STUDENT").length;

    return NextResponse.json({
      success: true,
      centre,
      owner: ownerMembership?.user || null,
      stats: {
        totalStudents: studentCount,
        totalStaff: staffCount,
        totalBatches: centre.classBatches.length,
        totalBranches: centre.branches.length,
        saasPaymentsCount: centre.saasPayments.length,
      },
    });
  } catch (error) {
    console.error("Get centre detail error:", error);
    return NextResponse.json({ error: "Failed to retrieve centre dossier" }, { status: 500 });
  }
}
