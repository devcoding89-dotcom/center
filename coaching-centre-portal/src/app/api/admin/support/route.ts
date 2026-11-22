import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        centre: { select: { id: true, name: true, slug: true } },
        student: {
          select: {
            id: true,
            registrationNumber: true,
            user: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (err: any) {
    console.error("Admin support GET error:", err);
    return NextResponse.json({ error: "Failed to load support tickets" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized Super Admin clearance required" }, { status: 403 });
  }

  try {
    const { ticketId, status, adminReply } = await request.json();

    if (!ticketId) {
      return NextResponse.json({ error: "ticketId is required" }, { status: 400 });
    }

    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        ...(status ? { status } : {}),
        ...(adminReply ? { adminReply } : {}),
      },
      include: {
        centre: { select: { id: true, name: true } },
        student: { select: { user: { select: { id: true } } } },
      },
    });

    // Notify the user if a reply was provided
    if (adminReply && updated.student?.user?.id) {
      await prisma.notification.create({
        data: {
          centreId: updated.centreId,
          userId: updated.student.user.id,
          title: "Platform Support Reply",
          message: `Your inquiry has been updated by Platform Administration: "${adminReply.substring(0, 80)}..."`,
          type: "GENERAL",
          linkUrl: "/student/support",
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: context.userId,
        centreId: updated.centreId,
        action: "SUPPORT_TICKET_RESOLVED",
        details: `Ticket "${updated.subject}" status updated to ${updated.status}.`,
      },
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (err: any) {
    console.error("Admin support PATCH error:", err);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
