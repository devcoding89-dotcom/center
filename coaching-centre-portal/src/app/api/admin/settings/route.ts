import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const settings = await prisma.platformSetting.findMany({
      orderBy: { category: "asc" },
    });

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error("Admin settings GET error:", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const { key, value } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const updated = await prisma.platformSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value), category: "GENERAL" },
    });

    await prisma.auditLog.create({
      data: {
        userId: context.userId,
        action: "PLATFORM_SETTING_UPDATED",
        details: `Platform configuration "${key}" updated to "${value}"`,
      },
    });

    return NextResponse.json({ success: true, setting: updated });
  } catch (err: any) {
    console.error("Admin settings POST error:", err);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
