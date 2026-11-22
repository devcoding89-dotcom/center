import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.userId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  const tickets = await prisma.supportTicket.findMany({
    where: { studentId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, tickets });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      studentProfile: true,
      memberships: { where: { isActive: true } },
    },
  });

  if (!user || !user.studentProfile) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  const centreId = user.memberships[0]?.centreId;
  if (!centreId) {
    return NextResponse.json({ error: "No active centre membership" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { subject, category, message } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        centreId,
        studentId: user.studentProfile.id,
        subject: subject.trim(),
        category: category || "ACADEMIC",
        message: message.trim(),
        status: "SUBMITTED",
      },
    });

    // Create in-app notification confirming ticket submission
    await prisma.notification.create({
      data: {
        centreId,
        userId: user.id,
        title: "Support Ticket Logged",
        message: `Your enquiry regarding "${subject}" has been received by centre staff.`,
        type: "GENERAL",
        linkUrl: "/student/support",
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error("Support ticket error:", error);
    return NextResponse.json({ error: "Failed to submit support request" }, { status: 500 });
  }
}
