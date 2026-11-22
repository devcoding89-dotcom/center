import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      studentProfile: {
        include: {
          enrollments: {
            include: {
              classBatch: {
                include: {
                  programme: true,
                  timetableSlots: {
                    include: { subject: true },
                    orderBy: { dayOfWeek: "asc" },
                  },
                },
              },
            },
          },
          attendanceRecords: {
            include: { session: true },
            orderBy: { session: { sessionDate: "desc" } },
            take: 10,
          },
          invoices: {
            include: { payments: true },
            orderBy: { issuedAt: "desc" },
          },
        },
      },
      memberships: {
        where: { isActive: true },
        include: { centre: true },
      },
    },
  });

  if (!user || !user.studentProfile) {
    return NextResponse.json(
      { error: "Student profile not found" },
      { status: 404 }
    );
  }

  const centre = user.memberships[0]?.centre;

  // Calculate attendance metrics
  const totalRecords = user.studentProfile.attendanceRecords.length;
  const presentCount = user.studentProfile.attendanceRecords.filter(
    (r) => r.status === "PRESENT" || r.status === "LATE"
  ).length;
  const attendanceRate =
    totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 100;

  // Financial status
  const invoices = user.studentProfile.invoices;
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const balanceDue = totalBilled - totalPaid;

  // Recent announcements
  const announcements = centre
    ? await prisma.announcement.findMany({
        where: { centreId: centre.id },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    : [];

  // Notifications count & recent
  const [unreadNotificationCount, recentNotifications, supportTickets] = await Promise.all([
    prisma.notification.count({
      where: { userId: user.id, isRead: false },
    }),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.supportTicket.findMany({
      where: { studentId: user.studentProfile.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phoneNumber,
    },
    centre: centre
      ? {
          name: centre.name,
          slug: centre.slug,
          phone: centre.phone,
          email: centre.email,
          address: centre.address,
          session: centre.academicSession,
        }
      : null,
    profile: {
      registrationNumber: user.studentProfile.registrationNumber,
      targetExam: user.studentProfile.targetExam,
      targetCourse: user.studentProfile.targetCourse,
      targetInstitution: user.studentProfile.targetInstitution,
      guardianName: user.studentProfile.guardianName,
      guardianPhone: user.studentProfile.guardianPhone,
      guardianEmail: user.studentProfile.guardianEmail,
      dateOfBirth: user.studentProfile.dateOfBirth,
      address: user.studentProfile.address,
      enrollmentDate: user.studentProfile.enrollmentDate,
      lastSsoAt: user.studentProfile.lastSsoAt,
    },
    enrolledBatch: user.studentProfile.enrollments[0]?.classBatch || null,
    timetable:
      user.studentProfile.enrollments[0]?.classBatch?.timetableSlots || [],
    attendance: {
      rate: attendanceRate,
      totalMarked: totalRecords,
      presentCount,
      absentCount: totalRecords - presentCount,
      recentRecords: user.studentProfile.attendanceRecords,
    },
    finance: {
      totalBilled,
      totalPaid,
      balanceDue,
      invoices,
    },
    announcements,
    unreadNotificationCount,
    recentNotifications,
    supportTickets,
    studyMateEntitlement: {
      hasAccess: true,
      bundledPlan: "Included with Centre Subscription",
      features: [
        "JAMB & WAEC CBT Simulator",
        "Official Past Questions Bank",
        "AI Diagnostic Tutor",
        "Performance Analytics",
      ],
    },
  });
}
