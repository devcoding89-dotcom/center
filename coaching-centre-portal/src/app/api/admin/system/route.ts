import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const auditLogs = await prisma.auditLog.findMany({
      take: 40,
      orderBy: { createdAt: "desc" },
      include: {
        centre: { select: { name: true } },
        user: { select: { fullName: true, email: true } },
      },
    });

    // System Telemetry
    const counts = {
      users: await prisma.user.count(),
      centres: await prisma.centre.count(),
      subscriptions: await prisma.centreSubscription.count(),
      saasPayments: await prisma.saasPayment.count(),
      auditLogs: await prisma.auditLog.count(),
    };

    return NextResponse.json({
      success: true,
      health: {
        database: "OPERATIONAL",
        databaseEngine: "Prisma ORM (SQLite local / PostgreSQL staging)",
        uptimeSeconds: process.uptime(),
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        nodeVersion: process.version,
        counts,
      },
      auditLogs,
    });
  } catch (err: any) {
    console.error("Admin system GET error:", err);
    return NextResponse.json({ error: "Failed to load system health" }, { status: 500 });
  }
}
