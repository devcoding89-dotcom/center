import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const announcements = await prisma.platformAnnouncement.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, announcements });
  } catch (err: any) {
    console.error("Admin announcements GET error:", err);
    return NextResponse.json({ error: "Failed to load announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const { title, content, priority, targetAudience } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const created = await prisma.platformAnnouncement.create({
      data: {
        title,
        content,
        priority: priority || "NORMAL",
        targetAudience: targetAudience || "ALL",
        createdByAdminId: context.userId,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: context.userId,
        action: "PLATFORM_ANNOUNCEMENT_BROADCAST",
        details: `Broadcast announcement created: "${title}" (Priority: ${priority || "NORMAL"})`,
      },
    });

    return NextResponse.json({ success: true, announcement: created });
  } catch (err: any) {
    console.error("Admin announcements POST error:", err);
    return NextResponse.json({ error: "Failed to publish announcement" }, { status: 500 });
  }
}
