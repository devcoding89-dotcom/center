import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const search = searchParams.get("search")?.toLowerCase().trim();

  try {
    const centres = await prisma.centre.findMany({
      where: {
        ...(statusFilter && statusFilter !== "ALL"
          ? {
              status:
                statusFilter === "PENDING"
                  ? "PENDING_VERIFICATION"
                  : statusFilter,
            }
          : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } },
                { city: { contains: search } },
                { state: { contains: search } },
                { slug: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        subscription: true,
        branches: true,
        memberships: {
          where: { role: "CENTRE_OWNER", isPrimary: true },
          include: { user: { select: { fullName: true, email: true, phoneNumber: true } } },
        },
        _count: {
          select: {
            memberships: true,
            classBatches: true,
            invoices: true,
            saasPayments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const counts = {
      all: await prisma.centre.count(),
      active: await prisma.centre.count({ where: { status: "ACTIVE" } }),
      pending: await prisma.centre.count({ where: { status: "PENDING_VERIFICATION" } }),
      suspended: await prisma.centre.count({ where: { status: "SUSPENDED" } }),
    };

    return NextResponse.json({
      success: true,
      centres,
      counts,
    });
  } catch (error) {
    console.error("Admin centres error:", error);
    return NextResponse.json({ error: "Failed to fetch centres" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const { centreId, status, tier, actionReason } = await request.json();

    if (!centreId) {
      return NextResponse.json({ error: "centreId is required" }, { status: 400 });
    }

    const currentCentre = await prisma.centre.findUnique({
      where: { id: centreId },
      include: { subscription: true },
    });

    if (!currentCentre) {
      return NextResponse.json({ error: "Centre not found" }, { status: 404 });
    }

    const updated = await prisma.centre.update({
      where: { id: centreId },
      data: {
        ...(status ? { status } : {}),
        ...(tier
          ? {
              subscription: {
                upsert: {
                  create: {
                    tier,
                    status: "ACTIVE",
                    monthlyFeeNgn: tier === "STARTER" ? 5000 : tier === "PREMIUM" ? 20000 : 10000,
                    maxStudents: tier === "STARTER" ? 50 : tier === "PREMIUM" ? 500 : 150,
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                  },
                  update: {
                    tier,
                    monthlyFeeNgn: tier === "STARTER" ? 5000 : tier === "PREMIUM" ? 20000 : 10000,
                    maxStudents: tier === "STARTER" ? 50 : tier === "PREMIUM" ? 500 : 150,
                  },
                },
              },
            }
          : {}),
      },
      include: { subscription: true },
    });

    await prisma.auditLog.create({
      data: {
        centreId,
        userId: context.userId,
        action: `CENTRE_STATUS_${status || "UPDATED"}`,
        details: `Centre "${currentCentre.name}" status updated to ${status || currentCentre.status}. Reason: ${actionReason || "Administrative decision"}`,
      },
    });

    return NextResponse.json({ success: true, centre: updated });
  } catch (error) {
    console.error("Update centre error:", error);
    return NextResponse.json({ error: "Failed to update centre" }, { status: 500 });
  }
}
