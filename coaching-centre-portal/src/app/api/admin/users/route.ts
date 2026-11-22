import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const roleFilter = searchParams.get("role");
  const search = searchParams.get("search")?.toLowerCase().trim();

  try {
    const users = await prisma.user.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { fullName: { contains: search } },
                { email: { contains: search } },
                { phoneNumber: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        memberships: {
          include: { centre: { select: { name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const filteredUsers = users.filter((u) => {
      if (!roleFilter || roleFilter === "ALL") return true;
      if (roleFilter === "SUPER_ADMIN") return u.isSuperAdmin;
      return u.memberships.some((m) => m.role === roleFilter);
    });

    return NextResponse.json({
      success: true,
      users: filteredUsers,
    });
  } catch (err: any) {
    console.error("Admin users GET error:", err);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const { userId, isActive, isSuperAdmin } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(isActive !== undefined ? { isActive } : {}),
        ...(isSuperAdmin !== undefined ? { isSuperAdmin } : {}),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: context.userId,
        action: "USER_SECURITY_MODIFIED",
        details: `User ${updated.email} updated: isActive=${updated.isActive}, isSuperAdmin=${updated.isSuperAdmin}`,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    console.error("Admin users PATCH error:", err);
    return NextResponse.json({ error: "Failed to update user security" }, { status: 500 });
  }
}
