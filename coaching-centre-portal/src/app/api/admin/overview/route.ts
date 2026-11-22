import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    // 1. Centres Statistics
    const allCentres = await prisma.centre.findMany({
      include: {
        subscription: true,
        _count: {
          select: {
            memberships: true,
            classBatches: true,
            saasPayments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalCentres = allCentres.length;
    const activeCentres = allCentres.filter((c) => c.status === "ACTIVE").length;
    const pendingCentres = allCentres.filter((c) => c.status === "PENDING_VERIFICATION").length;
    const suspendedCentres = allCentres.filter((c) => c.status === "SUSPENDED").length;

    // 2. Global Populations
    const totalStudents = await prisma.studentProfile.count();
    const totalStaff = await prisma.staffProfile.count();

    // 3. Subscriptions & SaaS MRR (From centre subscriptions)
    const activeSubscriptions = await prisma.centreSubscription.count({
      where: { status: "ACTIVE" },
    });

    const mrr = allCentres.reduce((sum, c) => {
      if (c.subscription?.status === "ACTIVE") {
        return sum + (c.subscription.monthlyFeeNgn || 0);
      }
      return sum;
    }, 0);

    // 4. Actual SaaS Revenue (Collected from SaasPayment records)
    const saasPayments = await prisma.saasPayment.findMany({
      where: { status: "SUCCESS" },
      orderBy: { createdAt: "desc" },
    });

    const totalSaasRevenue = saasPayments.reduce((sum, p) => sum + p.amountNgn, 0);

    // 5. Subscription Plan Breakdown
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
    });

    const planDistribution = plans.map((plan) => {
      const count = allCentres.filter((c) => c.subscription?.tier === plan.code).length;
      return {
        code: plan.code,
        name: plan.name,
        priceNgn: plan.priceNgn,
        count,
      };
    });

    // 6. Recent Platform Activities
    const recentSaasPayments = await prisma.saasPayment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { centre: { select: { name: true, slug: true } } },
    });

    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        centre: { select: { name: true } },
        user: { select: { fullName: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalCentres,
        activeCentres,
        pendingCentres,
        suspendedCentres,
        totalStudents,
        totalStaff,
        activeSubscriptions,
        mrr,
        totalSaasRevenue,
      },
      planDistribution,
      recentCentres: allCentres.slice(0, 5),
      recentSaasPayments,
      recentAuditLogs,
    });
  } catch (err: any) {
    console.error("Super Admin Overview Error:", err);
    return NextResponse.json({ error: "Failed to load platform overview" }, { status: 500 });
  }
}
