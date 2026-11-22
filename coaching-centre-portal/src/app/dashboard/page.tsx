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
  BookOpen,
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
  Sparkles,
  ExternalLink,
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
      <DashboardLayout headerTitle="Centre Dashboard">
        <div className="space-y-6">
          <div className="skeleton h-24 w-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-28" />)}
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
      headerTitle="Centre Dashboard"
      headerSubtitle={`${centre?.name || "Coaching Centre"} • ${centre?.city || ""}, ${centre?.state || "Nigeria"}`}
    >
      <div className="space-y-6">

        {/* ── Welcome Banner (Modern Navy & Royal Blue) ── */}
        <div className="anim-fade-up relative rounded-xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-6 shadow-md border border-slate-800">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-blue-300 tracking-wide uppercase">{getDayLabel()}</p>
              <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
                {getGreeting()}, {userFullName?.split(" ")[0] || "Admin"} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                <span className="font-semibold text-white">{centre?.name}</span> • Academic Session {centre?.academicSession || "2026/2027"}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Link
                href="/students"
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Enroll Student
              </Link>
              <Link
                href="/attendance"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                Mark Attendance
              </Link>
            </div>
          </div>
        </div>

        {/* ── Alert Banners ── */}
        {(hasOverdue || hasLowAttendance || hasSubAlert) && (
          <div className="space-y-2 anim-fade-up-1">
            {hasSubAlert && (
              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 shadow-2xs">
                <Bell className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-semibold flex-1">
                  {subscriptionAlert?.expired
                    ? `Your ${subscriptionAlert?.plan} plan has expired. Renew to avoid interruption.`
                    : `Your ${subscriptionAlert?.plan} plan expires in ${subscriptionAlert?.daysLeft} day${subscriptionAlert?.daysLeft === 1 ? "" : "s"}.`}
                </span>
                <Link href="/settings" className="text-xs font-bold text-amber-800 underline shrink-0">Manage →</Link>
              </div>
            )}
            {hasOverdue && (
              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs font-semibold flex-1">
                  {metrics.overdueCount} student invoice{metrics.overdueCount !== 1 ? "s are" : " is"} overdue. Outstanding balance: {formatNaira(metrics.outstandingBalance)}.
                </span>
                <Link href="/finance" className="text-xs font-bold text-rose-800 underline shrink-0">Finance →</Link>
              </div>
            )}
            {hasLowAttendance && (
              <div className="flex items-center gap-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 shadow-2xs">
                <TrendingDown className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-semibold flex-1">
                  {lowAttendanceStudents.length} student{lowAttendanceStudents.length !== 1 ? "s have" : " has"} attendance below 70% this month.
                </span>
                <button
                  onClick={() => document.getElementById("low-attendance-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs font-bold text-amber-800 underline shrink-0"
                >
                  View ↓
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 anim-fade-up-2">
          <StatCard
            title="Enrolled Students"
            value={metrics?.totalStudents || 0}
            subtitle={`Plan limit: ${centre?.subscription?.maxStudents || 150}`}
            icon={Users}
            color="blue"
            trend={{ value: "100% active", positive: true }}
          />
          <StatCard
            title="Teaching Staff"
            value={metrics?.totalStaff || 0}
            subtitle={`${metrics?.teacherCount || 0} teachers`}
            icon={GraduationCap}
            color="navy"
          />
          <StatCard
            title="Today's Attendance"
            value={metrics?.attendanceRate !== null && metrics?.attendanceRate !== undefined ? `${metrics.attendanceRate}%` : "—"}
            subtitle={
              metrics?.todaySessionsCount
                ? `${metrics.todayPresent}/${metrics.todayTotalMarked} present`
                : "No session marked yet"
            }
            icon={CalendarCheck}
            color="blue"
            trend={
              metrics?.attendanceRate != null
                ? { value: metrics.attendanceRate >= 80 ? "On schedule" : "Needs attention", positive: metrics.attendanceRate >= 80 }
                : undefined
            }
          />
          <StatCard
            title="Tuition Collected"
            value={formatNaira(metrics?.totalPaid || 0)}
            subtitle={`Balance: ${formatNaira(metrics?.outstandingBalance || 0)}`}
            icon={CreditCard}
            color="emerald"
          />
        </div>

        {/* ── Quick Administrative Actions ── */}
        <div className="anim-fade-up-3 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick Administrative Actions
            </h2>
            <span className="text-xs text-slate-500 font-medium">Session {centre?.academicSession || "2026/2027"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { href: "/students", icon: Plus, label: "Enroll", sub: "JAMB / WAEC" },
              { href: "/attendance", icon: CalendarCheck, label: "Attendance", sub: "Daily roll-call" },
              { href: "/finance", icon: Banknote, label: "Record Payment", sub: "Receipts in ₦" },
              { href: "/batches", icon: Layers, label: "Class Batches", sub: "Morning / Weekend" },
              { href: "/timetable", icon: Calendar, label: "Timetable", sub: "Weekly schedule" },
              { href: "/announcements", icon: Megaphone, label: "Announce", sub: "Student notices" },
            ].map(({ href, icon: Icon, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-2 p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 transition-all text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{label}</div>
                  <div className="text-[10px] text-slate-500">{sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── StudyMate Learning Insights Highlight Card ── */}
        <div className="anim-fade-up-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">StudyMate Learning Insights</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {metrics?.totalStudents || 0} enrolled students connected. Timed CBT practice, past questions &amp; AI diagnostics.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/studymate-insights"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>View Weak Topics &amp; Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Today's Timetable + Fee Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Timetable */}
          <div className="anim-fade-up-5 lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-700" />
                  Today's Lecture Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date().toLocaleDateString("en-NG", { weekday: "long" })} classes
                </p>
              </div>
              <Link href="/timetable" className="text-xs text-blue-600 hover:underline font-bold">
                Full timetable →
              </Link>
            </div>

            <div className="mt-4">
              {todayTimetable.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium">No classes scheduled for today.</p>
                  <Link href="/timetable" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Set up timetable →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayTimetable.map((slot: any) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
                    >
                      <div className="text-center min-w-[56px]">
                        <div className="text-[11px] font-bold text-blue-700">{slot.startTime}</div>
                        <div className="text-[10px] text-slate-400">{slot.endTime}</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{slot.subject?.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{slot.classBatch?.name}</div>
                      </div>
                      {slot.teacherName && (
                        <div className="text-[11px] text-slate-600 shrink-0">{slot.teacherName}</div>
                      )}
                      {slot.room && (
                        <div className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold shrink-0">
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
          <div className="anim-fade-up-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                Fee Summary
              </h3>
              <Link href="/finance" className="text-xs text-blue-600 hover:underline font-bold">
                Finance →
              </Link>
            </div>

            <div className="mt-4 space-y-3 flex-1">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/70 border border-blue-100">
                <div>
                  <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Total Invoiced</div>
                  <div className="text-sm font-extrabold text-blue-950 mt-0.5">{formatNaira(metrics?.totalInvoiced || 0)}</div>
                </div>
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <div>
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Collected</div>
                  <div className="text-sm font-extrabold text-emerald-950 mt-0.5">{formatNaira(metrics?.totalPaid || 0)}</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50/70 border border-rose-100">
                <div>
                  <div className="text-[10px] font-bold text-rose-800 uppercase tracking-wide">Outstanding</div>
                  <div className="text-sm font-extrabold text-rose-950 mt-0.5">{formatNaira(metrics?.outstandingBalance || 0)}</div>
                </div>
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>

              {(metrics?.totalInvoiced || 0) > 0 && (
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] text-slate-600 mb-1.5">
                    <span className="font-semibold">Collection rate</span>
                    <span className="font-extrabold text-slate-900">
                      {Math.round(((metrics?.totalPaid || 0) / (metrics?.totalInvoiced || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
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
          <div className="anim-fade-up-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-amber-600" />
                  Low Attendance Warning
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Students below 70% in the last 30 days</p>
              </div>
              <Link href="/attendance" className="text-xs text-blue-600 hover:underline font-bold">
                Roll-call →
              </Link>
            </div>

            <div className="mt-4">
              {lowAttendanceStudents.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  <CheckCircle2 className="w-7 h-7 mx-auto mb-2 text-emerald-600" />
                  <p className="text-xs font-semibold text-emerald-800">All students have good attendance records.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">No students below 70% threshold this month.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {lowAttendanceStudents.map((s: any) => (
                    <div key={s.studentId} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/60 border border-amber-200">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs">
                        {s.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.sessionsAttended}/{s.totalSessions} sessions attended</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-sm font-extrabold ${s.attendanceRate < 50 ? "text-rose-600" : "text-amber-700"}`}>
                          {s.attendanceRate}%
                        </div>
                        <div className="text-[10px] font-bold text-slate-500">
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
          <div className="anim-fade-up-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  Recent Fee Receipts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Latest collections recorded</p>
              </div>
              <Link href="/finance" className="text-xs text-blue-600 hover:underline font-bold">
                All receipts →
              </Link>
            </div>

            <div className="mt-4">
              {recentPayments.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Banknote className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium">No payments recorded yet.</p>
                  <Link href="/finance" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Record a payment →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentPayments.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {p.invoice?.student?.user?.fullName || "Student"}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{p.invoice?.title || "Tuition payment"}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatDate(p.paidAt)} • {p.paymentMethod?.replace("_", " ")}
                        </div>
                      </div>
                      <div className="text-sm font-extrabold text-emerald-700 shrink-0">
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
          {/* Batches Overview */}
          <div className="anim-fade-up-6 lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  Active Class Batches
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Scheduled lecture streams and hall allocations</p>
              </div>
              <Link href="/batches" className="text-xs text-blue-600 hover:underline font-bold">
                View all batches →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {batches.length === 0 ? (
                <div className="col-span-2 py-10 text-center text-slate-400">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium">No class batches created yet.</p>
                  <Link href="/batches" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Create a batch →</Link>
                </div>
              ) : (
                batches.map((b: any) => {
                  const enrolled = b._count?.enrollments || 0;
                  const fillPct = b.capacity > 0 ? Math.min(100, Math.round((enrolled / b.capacity) * 100)) : 0;
                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all card-lift flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                            {b.programme?.examCategory?.replace("_", " ")}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {enrolled} / {b.capacity} enrolled
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-900 mt-2">{b.name}</div>
                        {b.schedule && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{b.schedule}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                        <span>Room: {b.roomNumber || "Main Hall"}</span>
                        <span className="text-emerald-700 font-bold">Active</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="anim-fade-up-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-blue-700" />
                  <h3 className="text-sm font-bold text-slate-900">Announcements</h3>
                </div>
                <Link href="/announcements" className="text-xs text-blue-600 hover:underline font-bold">
                  Post
                </Link>
              </div>

              <div className="mt-3 space-y-3">
                {announcements.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <p className="text-xs font-medium">No announcements posted.</p>
                  </div>
                ) : (
                  announcements.map((a: any) => (
                    <div key={a.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <div className="text-xs font-bold text-slate-900">{a.title}</div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                        {a.content}
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400">{formatDate(a.createdAt)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {announcements.length > 0 && (
              <Link
                href="/announcements"
                className="mt-4 pt-3 border-t border-slate-100 text-xs text-blue-600 font-bold flex items-center justify-center gap-1 hover:gap-1.5 transition-all"
              >
                View all announcements <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* ── Recently Enrolled Students Table ── */}
        <div className="anim-fade-up-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recently Enrolled Students</h3>
              <p className="text-xs text-slate-500 mt-0.5">Newly registered candidates for this session</p>
            </div>
            <Link href="/students" className="text-xs text-blue-600 hover:underline font-bold">
              Manage all students →
            </Link>
          </div>

          <div className="mt-3 overflow-x-auto">
            {recentStudents.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium">No students enrolled yet.</p>
                <Link href="/students" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Enroll student →</Link>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Reg Number</th>
                    <th className="py-2.5 px-3">Target Exam</th>
                    <th className="py-2.5 px-3">Class Batch</th>
                    <th className="py-2.5 px-3">Guardian Contact</th>
                    <th className="py-2.5 px-3">Enrolled Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentStudents.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {s.user?.fullName}
                        <div className="text-[11px] font-normal text-slate-500">{s.user?.email}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                        {s.registrationNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          {s.targetExam?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {s.enrollments?.[0]?.classBatch?.name || (
                          <span className="text-slate-400 italic">Not Assigned</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <div>{s.guardianName || "-"}</div>
                        <div className="text-[11px] text-slate-400">{s.guardianPhone || ""}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
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
