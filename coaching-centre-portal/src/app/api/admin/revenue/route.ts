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

  try {
    const payments = await prisma.saasPayment.findMany({
      where: {
        ...(statusFilter && statusFilter !== "ALL" ? { status: statusFilter } : {}),
      },
      include: {
        centre: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Summary calculations strictly for SaaS subscription revenue
    const totalCollected = payments
      .filter((p) => p.status === "SUCCESS")
      .reduce((sum, p) => sum + p.amountNgn, 0);

    const pendingAmount = payments
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + p.amountNgn, 0);

    const successfulCount = payments.filter((p) => p.status === "SUCCESS").length;
    const failedCount = payments.filter((p) => p.status === "FAILED").length;

    return NextResponse.json({
      success: true,
      metrics: {
        totalCollected,
        pendingAmount,
        successfulCount,
        failedCount,
        totalTransactions: payments.length,
      },
      payments,
    });
  } catch (err: any) {
    console.error("Admin revenue error:", err);
    return NextResponse.json({ error: "Failed to load revenue ledger" }, { status: 500 });
  }
}
