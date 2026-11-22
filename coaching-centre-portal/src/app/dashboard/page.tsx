"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import {
  Users,
  Layers,
  CalendarCheck,
  CreditCard,
  Plus,
  Clock,
  Megaphone,
  ArrowRight,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Banknote,
  Calendar,
  GraduationCap,
  FileText,
  Bell,
  ChevronRight,
} from "lucide-react";
import { formatNaira, formatDate } from "@/lib/utils";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getDayLabel() {
  return new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await fetch("/api/centre/overview");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Dashboard overview fetch error", e);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  if (loading) {
    return (
      <DashboardLayout headerTitle="Dashboard">
        <div className="space-y-6">
          <div className="skeleton h-20 w-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-24" />)}
          </div>
          <div className="skeleton h-16 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 skeleton h-64" />
            <div className="skeleton h-64" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const {
    metrics,
    centre,
    recentStudents = [],
    announcements = [],
    batches = [],
    todayTimetable = [],
    lowAttendanceStudents = [],
    recentPayments = [],
    subscriptionAlert,
    userFullName,
  } = data || {};

  const hasOverdue = (metrics?.overdueCount || 0) > 0;
  const hasLowAttendance = lowAttendanceStudents.length > 0;
  const hasSubAlert = !!subscriptionAlert;

  return (
    <DashboardLayout
      headerTitle="Overview"
      headerSubtitle={`${centre?.name || "Coaching Centre"} • ${centre?.city || ""}, ${centre?.state || "Nigeria"}`}
    >
      <div className="space-y-6">

        {/* ── Welcome Header (Linear / Stripe Minimalist) ── */}
        <div className="zinc-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{getDayLabel()}</p>
            <h1 className="text-xl font-bold text-zinc-950 tracking-tight mt-1">
              {getGreeting()}, {userFullName?.split(" ")[0] || "Admin"}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {centre?.name} • Session {centre?.academicSession || "2026/2027"}
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link
              href="/students"
              className="px-3.5 py-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Enroll Student
            </Link>
            <Link
              href="/attendance"
              className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Mark Attendance
            </Link>
          </div>
        </div>

        {/* ── Alert Notices ── */}
        {(hasOverdue || hasLowAttendance || hasSubAlert) && (
          <div className="space-y-2">
            {hasSubAlert && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs">
                <Bell className="w-4 h-4 text-zinc-600 shrink-0" />
                <span className="font-medium flex-1">
                  {subscriptionAlert?.expired
                    ? `Your ${subscriptionAlert?.plan} plan has expired.`
                    : `Your ${subscriptionAlert?.plan} plan expires in ${subscriptionAlert?.daysLeft} days.`}
                </span>
                <Link href="/settings" className="font-semibold text-zinc-950 hover:underline shrink-0">Manage →</Link>
              </div>
            )}
            {hasOverdue && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-zinc-700 shrink-0" />
                <span className="font-medium flex-1">
                  {metrics.overdueCount} student invoice{metrics.overdueCount !== 1 ? "s" : ""} overdue. Outstanding: {formatNaira(metrics.outstandingBalance)}.
                </span>
                <Link href="/finance" className="font-semibold text-zinc-950 hover:underline shrink-0">Finance →</Link>
              </div>
            )}
            {hasLowAttendance && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs">
                <TrendingDown className="w-4 h-4 text-zinc-700 shrink-0" />
                <span className="font-medium flex-1">
                  {lowAttendanceStudents.length} student{lowAttendanceStudents.length !== 1 ? "s" : ""} have attendance below 70% this month.
                </span>
                <button
                  onClick={() => document.getElementById("low-attendance-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-semibold text-zinc-950 hover:underline shrink-0"
                >
                  View ↓
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Enrolled Students"
            value={metrics?.totalStudents || 0}
            subtitle={`Plan limit: ${centre?.subscription?.maxStudents || 150}`}
            icon={Users}
            trend={{ value: "100% active", positive: true }}
          />
          <StatCard
            title="Teaching Staff"
            value={metrics?.totalStaff || 0}
            subtitle={`${metrics?.teacherCount || 0} teachers`}
            icon={GraduationCap}
          />
          <StatCard
            title="Today's Attendance"
            value={metrics?.attendanceRate !== null && metrics?.attendanceRate !== undefined ? `${metrics.attendanceRate}%` : "—"}
            subtitle={
              metrics?.todaySessionsCount
                ? `${metrics.todayPresent}/${metrics.todayTotalMarked} present`
                : "No session marked"
            }
            icon={CalendarCheck}
            trend={
              metrics?.attendanceRate != null
                ? { value: metrics.attendanceRate >= 80 ? "On schedule" : "Attention needed", positive: metrics.attendanceRate >= 80 }
                : undefined
            }
          />
          <StatCard
            title="Tuition Collected"
            value={formatNaira(metrics?.totalPaid || 0)}
            subtitle={`Balance: ${formatNaira(metrics?.outstandingBalance || 0)}`}
            icon={CreditCard}
          />
        </div>

        {/* ── Quick Actions ── */}
        <div className="zinc-card p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Quick Operations
            </h2>
            <span className="text-xs text-zinc-400">Session {centre?.academicSession || "2026/2027"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { href: "/students", icon: Plus, label: "Enroll Student", sub: "JAMB / WAEC" },
              { href: "/attendance", icon: CalendarCheck, label: "Attendance", sub: "Daily roll-call" },
              { href: "/finance", icon: Banknote, label: "Record Payment", sub: "Receipts in ₦" },
              { href: "/batches", icon: Layers, label: "Class Batches", sub: "Lecture streams" },
              { href: "/timetable", icon: Calendar, label: "Timetable", sub: "Weekly schedule" },
              { href: "/announcements", icon: Megaphone, label: "Announcements", sub: "Post notices" },
            ].map(({ href, icon: Icon, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="group p-3 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-700 flex items-center justify-center mb-2 group-hover:bg-zinc-200">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-zinc-900">{label}</div>
                <div className="text-[11px] text-zinc-500">{sub}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── StudyMate Learning Engine ── */}
        <div className="zinc-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-zinc-950">StudyMate CBT Engine</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {metrics?.totalStudents || 0} enrolled students connected. Timed CBT practice, past questions &amp; diagnostics.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/studymate-insights"
            className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>View Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Timetable & Fee Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Timetable */}
          <div className="lg:col-span-2 zinc-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  Today's Lecture Schedule
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {new Date().toLocaleDateString("en-NG", { weekday: "long" })} classes
                </p>
              </div>
              <Link href="/timetable" className="text-xs font-medium text-zinc-900 hover:underline">
                Full schedule →
              </Link>
            </div>

            <div className="mt-3">
              {todayTimetable.length === 0 ? (
                <div className="py-8 text-center text-zinc-400">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-zinc-300" />
                  <p className="text-xs">No classes scheduled for today.</p>
                  <Link href="/timetable" className="text-xs text-zinc-700 hover:underline mt-1 inline-block">Set up timetable →</Link>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {todayTimetable.map((slot: any) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-200/70 hover:bg-zinc-50/80 transition-colors"
                    >
                      <div className="text-center min-w-[50px]">
                        <div className="text-xs font-semibold text-zinc-900">{slot.startTime}</div>
                        <div className="text-[10px] text-zinc-400">{slot.endTime}</div>
                      </div>
                      <div className="w-px h-6 bg-zinc-200" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-zinc-900 truncate">{slot.subject?.name}</div>
                        <div className="text-[11px] text-zinc-500 truncate">{slot.classBatch?.name}</div>
                      </div>
                      {slot.teacherName && (
                        <div className="text-[11px] text-zinc-500 shrink-0">{slot.teacherName}</div>
                      )}
                      {slot.room && (
                        <div className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium shrink-0">
                          {slot.room}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fee Collection Summary */}
          <div className="zinc-card p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                Fee Summary
              </h3>
              <Link href="/finance" className="text-xs font-medium text-zinc-900 hover:underline">
                Finance →
              </Link>
            </div>

            <div className="mt-3 space-y-2.5 flex-1">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Total Invoiced</div>
                <div className="text-base font-bold text-zinc-950 mt-0.5">{formatNaira(metrics?.totalInvoiced || 0)}</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Collected</div>
                <div className="text-base font-bold text-zinc-950 mt-0.5">{formatNaira(metrics?.totalPaid || 0)}</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Outstanding</div>
                <div className="text-base font-bold text-zinc-950 mt-0.5">{formatNaira(metrics?.outstandingBalance || 0)}</div>
              </div>

              {(metrics?.totalInvoiced || 0) > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                    <span>Collection rate</span>
                    <span className="font-semibold text-zinc-900">
                      {Math.round(((metrics?.totalPaid || 0) / (metrics?.totalInvoiced || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-zinc-900 transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.round(((metrics?.totalPaid || 0) / (metrics?.totalInvoiced || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Low Attendance + Recent Payments ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="low-attendance-section">
          {/* Low Attendance */}
          <div className="zinc-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-zinc-600" />
                  Low Attendance Warning
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Students below 70% in last 30 days</p>
              </div>
              <Link href="/attendance" className="text-xs font-medium text-zinc-900 hover:underline">
                Roll-call →
              </Link>
            </div>

            <div className="mt-3">
              {lowAttendanceStudents.length === 0 ? (
                <div className="py-6 text-center text-zinc-400">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-zinc-300" />
                  <p className="text-xs">All students have good attendance records.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {lowAttendanceStudents.map((s: any) => (
                    <div key={s.studentId} className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
                      <div className="w-7 h-7 rounded-md bg-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 font-bold text-xs">
                        {s.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-zinc-900 truncate">{s.name}</div>
                        <div className="text-[11px] text-zinc-500">{s.sessionsAttended}/{s.totalSessions} sessions attended</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-zinc-950">{s.attendanceRate}%</div>
                        <div className="text-[10px] text-zinc-500">
                          {s.attendanceRate < 50 ? "Critical" : "At Risk"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="zinc-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-zinc-600" />
                  Recent Fee Receipts
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Latest collections recorded</p>
              </div>
              <Link href="/finance" className="text-xs font-medium text-zinc-900 hover:underline">
                All receipts →
              </Link>
            </div>

            <div className="mt-3">
              {recentPayments.length === 0 ? (
                <div className="py-6 text-center text-zinc-400">
                  <Banknote className="w-6 h-6 mx-auto mb-1 text-zinc-300" />
                  <p className="text-xs">No payments recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {recentPayments.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
                      <div className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-zinc-900 truncate">
                          {p.invoice?.student?.user?.fullName || "Student"}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate">{p.invoice?.title || "Fee receipt"}</div>
                      </div>
                      <div className="text-xs font-bold text-zinc-950 shrink-0 font-mono">
                        {formatNaira(p.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Active Batches + Announcements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 zinc-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-500" />
                  Active Class Batches
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Lecture streams and hall allocations</p>
              </div>
              <Link href="/batches" className="text-xs font-medium text-zinc-900 hover:underline">
                Manage →
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {batches.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-zinc-400">
                  <p className="text-xs">No class batches created yet.</p>
                </div>
              ) : (
                batches.map((b: any) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-lg border border-zinc-200/90 bg-white hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                        {b.programme?.examCategory?.replace("_", " ")}
                      </span>
                      <span className="text-xs font-semibold text-zinc-600">
                        {b._count?.enrollments || 0} / {b.capacity}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-zinc-950 mt-2">{b.name}</div>
                    {b.schedule && (
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{b.schedule}</span>
                      </div>
                    )}
                    <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Room: {b.roomNumber || "Main Hall"}</span>
                      <span className="font-semibold text-zinc-800">Active</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="zinc-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-zinc-500" />
                  <h3 className="text-sm font-semibold text-zinc-950">Announcements</h3>
                </div>
                <Link href="/announcements" className="text-xs font-medium text-zinc-900 hover:underline">
                  Post
                </Link>
              </div>

              <div className="mt-3 space-y-2.5">
                {announcements.length === 0 ? (
                  <div className="py-6 text-center text-zinc-400">
                    <p className="text-xs">No announcements posted.</p>
                  </div>
                ) : (
                  announcements.map((a: any) => (
                    <div key={a.id} className="p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
                      <div className="text-xs font-semibold text-zinc-900">{a.title}</div>
                      <div className="text-xs text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
                        {a.content}
                      </div>
                      <div className="mt-1.5 text-[10px] text-zinc-400">{formatDate(a.createdAt)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {announcements.length > 0 && (
              <Link
                href="/announcements"
                className="mt-3 pt-2 border-t border-zinc-100 text-xs font-medium text-zinc-900 flex items-center justify-center gap-1"
              >
                View all announcements <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* ── Recently Enrolled Students Table ── */}
        <div className="zinc-card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950">Recently Enrolled Students</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Newly registered candidates for this session</p>
            </div>
            <Link href="/students" className="text-xs font-medium text-zinc-900 hover:underline">
              Manage all →
            </Link>
          </div>

          <div className="mt-3 overflow-x-auto">
            {recentStudents.length === 0 ? (
              <div className="py-6 text-center text-zinc-400">
                <p className="text-xs">No students enrolled yet.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-600 font-semibold">
                    <th className="py-2 px-3">Student Name</th>
                    <th className="py-2 px-3">Reg Number</th>
                    <th className="py-2 px-3">Target Exam</th>
                    <th className="py-2 px-3">Class Batch</th>
                    <th className="py-2 px-3">Guardian Contact</th>
                    <th className="py-2 px-3">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentStudents.map((s: any) => (
                    <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-2 px-3 font-semibold text-zinc-950">
                        {s.user?.fullName}
                        <div className="text-[11px] font-normal text-zinc-400">{s.user?.email}</div>
                      </td>
                      <td className="py-2 px-3 font-mono font-medium text-zinc-700">
                        {s.registrationNumber}
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {s.targetExam?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-zinc-700">
                        {s.enrollments?.[0]?.classBatch?.name || (
                          <span className="text-zinc-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-zinc-600">
                        <div>{s.guardianName || "—"}</div>
                        <div className="text-[11px] text-zinc-400">{s.guardianPhone || ""}</div>
                      </td>
                      <td className="py-2 px-3 text-zinc-400">
                        {formatDate(s.enrollmentDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
