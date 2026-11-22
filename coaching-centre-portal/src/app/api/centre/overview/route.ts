import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.centreId) {
    return NextResponse.json({ error: "No active centre context" }, { status: 400 });
  }

  const { centreId } = context;

  // Centre details with subscription
  const centre = await prisma.centre.findUnique({
    where: { id: centreId },
    include: {
      subscription: true,
      branches: true,
    },
  });

  if (!centre) {
    return NextResponse.json({ error: "Centre not found" }, { status: 404 });
  }

  // --- Active student IDs ---
  const studentMemberships = await prisma.membership.findMany({
    where: { centreId, role: "STUDENT", isActive: true },
    select: { userId: true },
  });
  const studentUserIds = studentMemberships.map((m) => m.userId);
  const totalStudents = studentUserIds.length;

  // --- Staff count by role ---
  const staffMemberships = await prisma.membership.findMany({
    where: {
      centreId,
      role: { in: ["CENTRE_OWNER", "CENTRE_MANAGER", "ACCOUNTANT", "TEACHER"] },
      isActive: true,
    },
    select: { role: true },
  });
  const totalStaff = staffMemberships.length;
  const teacherCount = staffMemberships.filter((m) => m.role === "TEACHER").length;

  // --- Batch count ---
  const totalBatches = await prisma.classBatch.count({
    where: { centreId, isActive: true },
  });

  // --- Financial metrics ---
  const invoices = await prisma.invoice.findMany({
    where: { centreId },
    select: { totalAmount: true, paidAmount: true, status: true, dueDate: true },
  });

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const outstandingBalance = totalInvoiced - totalPaid;
  const overdueCount = invoices.filter(
    (inv) => inv.status === "OVERDUE" || (inv.status === "UNPAID" && inv.dueDate && new Date(inv.dueDate) < new Date())
  ).length;
  const unpaidCount = invoices.filter((inv) => inv.status === "UNPAID" || inv.status === "PARTIAL").length;

  // --- Today's attendance ---
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todaySessions = await prisma.attendanceSession.findMany({
    where: {
      centreId,
      sessionDate: { gte: startOfDay },
    },
    include: {
      records: true,
      classBatch: { select: { name: true } },
    },
  });

  let todayTotalMarked = 0;
  let todayPresent = 0;
  todaySessions.forEach((s) => {
    s.records.forEach((r) => {
      todayTotalMarked++;
      if (r.status === "PRESENT" || r.status === "LATE") {
        todayPresent++;
      }
    });
  });

  const attendanceRate =
    todayTotalMarked > 0 ? Math.round((todayPresent / todayTotalMarked) * 100) : null;

  // --- Today's timetable (day of week: 0=Sun so +1 = Mon=1..Sat=6) ---
  const todayDow = new Date().getDay(); // 0=Sun
  const mappedDow = todayDow === 0 ? 7 : todayDow; // our schema: 1=Mon..7=Sun

  const todayTimetable = await prisma.timetableSlot.findMany({
    where: { centreId, dayOfWeek: mappedDow },
    include: {
      classBatch: { select: { name: true } },
      subject: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
    take: 8,
  });

  // --- Low attendance students (< 70% over last 30 days) ---
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentSessions = await prisma.attendanceSession.findMany({
    where: { centreId, sessionDate: { gte: thirtyDaysAgo } },
    select: { id: true, classBatchId: true },
  });
  const sessionIds = recentSessions.map((s) => s.id);
  const totalSessionCount = recentSessions.length;

  let lowAttendanceStudents: any[] = [];
  if (totalSessionCount > 0 && studentUserIds.length > 0) {
    // Get attendance records grouped by student
    const records = await prisma.attendanceRecord.findMany({
      where: {
        attendanceSessionId: { in: sessionIds },
        student: { userId: { in: studentUserIds } },
      },
      select: {
        studentId: true,
        status: true,
        student: { select: { id: true, userId: true, user: { select: { fullName: true } } } },
      },
    });

    const studentMap = new Map<string, { name: string; present: number; total: number }>();
    records.forEach((r) => {
      const key = r.studentId;
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          name: r.student.user.fullName,
          present: 0,
          total: 0,
        });
      }
      const entry = studentMap.get(key)!;
      entry.total++;
      if (r.status === "PRESENT" || r.status === "LATE") entry.present++;
    });

    lowAttendanceStudents = Array.from(studentMap.entries())
      .map(([id, v]) => ({
        studentId: id,
        name: v.name,
        attendanceRate: Math.round((v.present / v.total) * 100),
        sessionsAttended: v.present,
        totalSessions: v.total,
      }))
      .filter((s) => s.attendanceRate < 70)
      .sort((a, b) => a.attendanceRate - b.attendanceRate)
      .slice(0, 5);
  }

  // --- Recent payments (last 5) ---
  const recentPayments = await prisma.payment.findMany({
    where: { centreId },
    orderBy: { paidAt: "desc" },
    take: 5,
    include: {
      invoice: {
        select: {
          student: { select: { user: { select: { fullName: true } } } },
          title: true,
        },
      },
    },
  });

  // --- Recent students ---
  const recentStudents = await prisma.studentProfile.findMany({
    where: { userId: { in: studentUserIds } },
    include: {
      user: { select: { fullName: true, email: true, phoneNumber: true } },
      enrollments: {
        include: { classBatch: { select: { name: true } } },
      },
    },
    take: 5,
    orderBy: { enrollmentDate: "desc" },
  });

  // --- Announcements ---
  const announcements = await prisma.announcement.findMany({
    where: { centreId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // --- Batches ---
  const batches = await prisma.classBatch.findMany({
    where: { centreId },
    include: {
      programme: { select: { name: true, examCategory: true } },
      _count: { select: { enrollments: true } },
    },
    take: 6,
  });

  // --- Subscription info ---
  const sub = centre.subscription;
  let subscriptionAlert = null;
  if (sub) {
    const daysLeft = sub.currentPeriodEnd
      ? Math.ceil((new Date(sub.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;
    if (daysLeft !== null && daysLeft <= 7 && daysLeft >= 0) {
      subscriptionAlert = { daysLeft, plan: sub.tier || "Standard" };
    }
    if (sub.status === "PAST_DUE" || sub.status === "SUSPENDED") {
      subscriptionAlert = { daysLeft: 0, plan: sub.tier || "Standard", expired: true };
    }
  }

  return NextResponse.json({
    centre,
    role: context.role,
    userFullName: context.userFullName,
    isSuperAdmin: context.isSuperAdmin,
    metrics: {
      totalStudents,
      totalStaff,
      teacherCount,
      totalBatches,
      totalInvoiced,
      totalPaid,
      outstandingBalance,
      overdueCount,
      unpaidCount,
      attendanceRate,
      todaySessionsCount: todaySessions.length,
      todayPresent,
      todayTotalMarked,
    },
    todayTimetable,
    lowAttendanceStudents,
    recentPayments,
    recentStudents,
    announcements,
    batches,
    subscriptionAlert,
  });
}
