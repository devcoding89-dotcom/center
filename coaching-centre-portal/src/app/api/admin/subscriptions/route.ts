import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { priceNgn: "asc" },
    });

    const subscriptions = await prisma.centreSubscription.findMany({
      include: {
        centre: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            _count: {
              select: { memberships: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      plans,
      subscriptions,
    });
  } catch (err: any) {
    console.error("Admin subscriptions GET error:", err);
    return NextResponse.json({ error: "Failed to load subscriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, name, code, priceNgn, studentLimit, staffLimit, featuresJson, description, isActive } = body;

    if (!name || !code || priceNgn === undefined || !studentLimit) {
      return NextResponse.json({ error: "Missing required plan fields" }, { status: 400 });
    }

    const plan = await prisma.subscriptionPlan.upsert({
      where: { code: code.toUpperCase() },
      update: {
        name,
        description,
        priceNgn: Number(priceNgn),
        studentLimit: Number(studentLimit),
        staffLimit: Number(staffLimit || 10),
        featuresJson: typeof featuresJson === "string" ? featuresJson : JSON.stringify(featuresJson || []),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      create: {
        name,
        code: code.toUpperCase(),
        description,
        priceNgn: Number(priceNgn),
        studentLimit: Number(studentLimit),
        staffLimit: Number(staffLimit || 10),
        featuresJson: typeof featuresJson === "string" ? featuresJson : JSON.stringify(featuresJson || []),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: context.userId,
        action: "SUBSCRIPTION_PLAN_CONFIGURED",
        details: `Subscription plan ${plan.name} (${plan.code}) updated to ₦${plan.priceNgn}/mo with ${plan.studentLimit} students limit.`,
      },
    });

    return NextResponse.json({ success: true, plan });
  } catch (err: any) {
    console.error("Admin subscriptions POST error:", err);
    return NextResponse.json({ error: "Failed to save subscription plan" }, { status: 500 });
  }
}
