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
  Zap,
  Sparkles,
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
          <div className="skeleton h-28 w-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-28" />)}
          </div>
          <div className="skeleton h-14 w-full" />
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

        {/* ── Welcome Banner ── */}
        <div className="anim-fade-up relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0ea5e9 100%)" }}>
          {/* animated orbs */}
          <div className="absolute w-64 h-64 rounded-full top-[-60px] right-[-40px] opacity-20" style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", animation: "float 6s ease-in-out infinite" }} />
          <div className="absolute w-32 h-32 rounded-full bottom-[-20px] left-20 opacity-10" style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)", animation: "float 4s 1s ease-in-out infinite" }} />

          <div className="relative z-10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-xs font-semibold text-indigo-200 mb-1 tracking-wide">{getDayLabel()}</p>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {getGreeting()}, {userFullName?.split(" ")[0] || "Admin"} 👋
              </h1>
              <p className="text-sm text-indigo-200 mt-1.5">
                <span className="font-semibold text-white">{centre?.name}</span> — Session {centre?.academicSession || "2026/2027"}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Link
                href="/students"
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 backdrop-blur-sm flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Enroll Student
              </Link>
              <Link
                href="/attendance"
                className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-black transition-all flex items-center gap-2 shadow-lg"
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
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-xs font-semibold flex-1">
                  {subscriptionAlert?.expired
                    ? `Your ${subscriptionAlert?.plan} plan has expired. Renew to avoid interruption.`
                    : `Your ${subscriptionAlert?.plan} plan expires in ${subscriptionAlert?.daysLeft} day${subscriptionAlert?.daysLeft === 1 ? "" : "s"}.`}
                </span>
                <Link href="/settings" className="text-xs font-black text-amber-700 hover:text-amber-900 shrink-0">Manage →</Link>
              </div>
            )}
            {hasOverdue && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <span className="text-xs font-semibold flex-1">
                  {metrics.overdueCount} overdue invoice{metrics.overdueCount !== 1 ? "s" : ""} — outstanding: {formatNaira(metrics.outstandingBalance)}.
                </span>
                <Link href="/finance" className="text-xs font-black text-rose-700 hover:text-rose-900 shrink-0">Finance →</Link>
              </div>
            )}
            {hasLowAttendance && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <span className="text-xs font-semibold flex-1">
                  {lowAttendanceStudents.length} student{lowAttendanceStudents.length !== 1 ? "s" : ""} below 70% attendance this month.
                </span>
                <button
                  onClick={() => document.getElementById("low-attendance-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs font-black text-orange-700 hover:text-orange-900 shrink-0"
                >
                  View ↓
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="anim-fade-up-2">
            <StatCard
              title="Enrolled Students"
              value={metrics?.totalStudents || 0}
              subtitle={`Limit: ${centre?.subscription?.maxStudents || 150}`}
              icon={Users}
              color="indigo"
              trend={{ value: "Active", positive: true }}
            />
          </div>
          <div className="anim-fade-up-3">
            <StatCard
              title="Teaching Staff"
              value={metrics?.totalStaff || 0}
              subtitle={`${metrics?.teacherCount || 0} teachers`}
              icon={GraduationCap}
              color="violet"
            />
          </div>
          <div className="anim-fade-up-4">
            <StatCard
              title="Today's Attendance"
              value={metrics?.attendanceRate !== null && metrics?.attendanceRate !== undefined ? `${metrics.attendanceRate}%` : "—"}
              subtitle={
                metrics?.todaySessionsCount
                  ? `${metrics.todayPresent}/${metrics.todayTotalMarked} present`
                  : "No session yet"
              }
              icon={CalendarCheck}
              color="cyan"
              trend={
                metrics?.attendanceRate != null
                  ? { value: metrics.attendanceRate >= 80 ? "On track" : "Needs attention", positive: metrics.attendanceRate >= 80 }
                  : undefined
              }
            />
          </div>
          <div className="anim-fade-up-5">
            <StatCard
              title="Fees Collected"
              value={formatNaira(metrics?.totalPaid || 0)}
              subtitle={`Balance: ${formatNaira(metrics?.outstandingBalance || 0)}`}
              icon={CreditCard}
              color="emerald"
            />
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="anim-fade-up-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Quick Actions</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Session {centre?.academicSession || "2026/2027"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { href: "/students",     icon: Plus,         label: "Enroll",      sub: "Student",    from: "#6366f1", to: "#8b5cf6" },
              { href: "/attendance",   icon: CalendarCheck, label: "Attendance",  sub: "Roll-call",  from: "#0ea5e9", to: "#06b6d4" },
              { href: "/finance",      icon: Banknote,     label: "Payment",     sub: "Record fee", from: "#10b981", to: "#059669" },
              { href: "/batches",      icon: Layers,        label: "Batches",     sub: "Classes",    from: "#8b5cf6", to: "#7c3aed" },
              { href: "/timetable",    icon: Calendar,      label: "Timetable",   sub: "Schedule",   from: "#f59e0b", to: "#d97706" },
              { href: "/announcements",icon: Megaphone,     label: "Announce",    sub: "Post notice",from: "#ec4899", to: "#db2777" },
            ].map(({ href, icon: Icon, label, sub, from, to }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-200 hover:border-transparent hover:shadow-lg transition-all duration-200 text-center relative overflow-hidden"
                style={{ ["--from" as any]: from, ["--to" as any]: to }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${from}15, ${to}25)` }}
                />
                <div
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${from}20, ${to}30)` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: from }} />
                </div>
                <div className="relative">
                  <div className="text-[11px] font-black text-slate-800 group-hover:text-slate-900">{label}</div>
                  <div className="text-[10px] text-slate-400">{sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── StudyMate Banner ── */}
        <div className="anim-fade-up-4 relative rounded-2xl overflow-hidden border border-indigo-100 bg-gradient-to-r from-indigo-50 via-violet-50 to-cyan-50 p-5 shadow-sm">
          <div className="absolute right-0 top-0 w-32 h-32 opacity-10 anim-float" style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg anim-pulse-ring shrink-0">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-black text-slate-900">StudyMate CBT Insights</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 badge-connected">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    CONNECTED
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {metrics?.totalStudents || 0} students enrolled. See CBT scores, weak subjects & exam readiness.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/studymate-insights"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-black shrink-0 flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
            >
              <Sparkles className="w-3.5 h-3.5" />
              View Analytics
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Today's Timetable + Fee Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Timetable */}
          <div className="anim-fade-up-5 lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  </div>
                  Today's Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 ml-8">
                  {new Date().toLocaleDateString("en-NG", { weekday: "long" })} classes
                </p>
              </div>
              <Link href="/timetable" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                Full timetable →
              </Link>
            </div>

            <div className="mt-4">
              {todayTimetable.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">No classes scheduled today.</p>
                  <Link href="/timetable" className="text-xs text-indigo-600 hover:underline mt-1 inline-block font-semibold">Set up timetable →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayTimetable.map((slot: any, i: number) => (
                    <div
                      key={slot.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white hover:from-indigo-50 hover:to-violet-50 hover:border-indigo-100 transition-all duration-200"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="text-center min-w-[52px]">
                        <div className="text-[11px] font-black text-indigo-600">{slot.startTime}</div>
                        <div className="text-[10px] text-slate-400">{slot.endTime}</div>
                      </div>
                      <div className="w-px h-8 bg-gradient-to-b from-indigo-200 to-violet-200" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">{slot.subject?.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{slot.classBatch?.name}</div>
                      </div>
                      {slot.teacherName && (
                        <div className="text-[11px] text-slate-500 shrink-0">{slot.teacherName}</div>
                      )}
                      {slot.room && (
                        <div className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold shrink-0">
                          {slot.room}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fee Summary */}
          <div className="anim-fade-up-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                Fee Summary
              </h3>
              <Link href="/finance" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold">Finance →</Link>
            </div>

            <div className="mt-4 space-y-3 flex-1">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
                <div>
                  <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Total Invoiced</div>
                  <div className="text-sm font-black text-indigo-900 mt-0.5">{formatNaira(metrics?.totalInvoiced || 0)}</div>
                </div>
                <CreditCard className="w-5 h-5 text-indigo-300" />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                <div>
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Collected</div>
                  <div className="text-sm font-black text-emerald-900 mt-0.5">{formatNaira(metrics?.totalPaid || 0)}</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100">
                <div>
                  <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Outstanding</div>
                  <div className="text-sm font-black text-rose-900 mt-0.5">{formatNaira(metrics?.outstandingBalance || 0)}</div>
                </div>
                <AlertTriangle className="w-5 h-5 text-rose-300" />
              </div>

              {(metrics?.totalInvoiced || 0) > 0 && (
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
                    <span className="font-semibold">Collection rate</span>
                    <span className="font-black text-slate-800">
                      {Math.round(((metrics?.totalPaid || 0) / (metrics?.totalInvoiced || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(100, Math.round(((metrics?.totalPaid || 0) / (metrics?.totalInvoiced || 1)) * 100))}%`,
                        background: "linear-gradient(90deg, #10b981, #059669)",
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
          <div className="anim-fade-up-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  Low Attendance
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 ml-8">Students below 70% — last 30 days</p>
              </div>
              <Link href="/attendance" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold">Roll-call →</Link>
            </div>

            <div className="mt-4">
              {lowAttendanceStudents.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  </div>
                  <p className="text-xs font-black text-emerald-700">All students attending well!</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Nobody below 70% this month.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {lowAttendanceStudents.map((s: any) => (
                    <div key={s.studentId} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
                        style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff" }}>
                        {s.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.sessionsAttended}/{s.totalSessions} sessions</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-sm font-black ${s.attendanceRate < 50 ? "text-rose-600" : "text-orange-600"}`}>
                          {s.attendanceRate}%
                        </div>
                        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${s.attendanceRate < 50 ? "bg-rose-100 text-rose-600" : "bg-orange-100 text-orange-600"}`}>
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
          <div className="anim-fade-up-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  Recent Payments
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 ml-8">Latest fee collections</p>
              </div>
              <Link href="/finance" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold">All receipts →</Link>
            </div>

            <div className="mt-4">
              {recentPayments.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <Banknote className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">No payments recorded yet.</p>
                  <Link href="/finance" className="text-xs text-indigo-600 hover:underline mt-1 inline-block font-semibold">Record a payment →</Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentPayments.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {p.invoice?.student?.user?.fullName || "Student"}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{p.invoice?.title || "Fee payment"}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatDate(p.paidAt)} · {p.paymentMethod?.replace("_", " ")}
                        </div>
                      </div>
                      <div className="text-sm font-black text-emerald-700 shrink-0">
                        {formatNaira(p.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Batches + Announcements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Batches */}
          <div className="anim-fade-up-7 lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-violet-600" />
                  </div>
                  Active Class Batches
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 ml-8">Lecture streams and hall allocations</p>
              </div>
              <Link href="/batches" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold">Manage →</Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {batches.length === 0 ? (
                <div className="col-span-2 py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">No batches yet.</p>
                  <Link href="/batches" className="text-xs text-indigo-600 hover:underline mt-1 inline-block font-semibold">Create a batch →</Link>
                </div>
              ) : (
                batches.map((b: any) => {
                  const enrolled = b._count?.enrollments || 0;
                  const fillPct = b.capacity > 0 ? Math.min(100, Math.round((enrolled / b.capacity) * 100)) : 0;
                  const barColor = fillPct >= 90 ? "#ef4444" : fillPct >= 70 ? "#f59e0b" : "#6366f1";
                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white hover:from-indigo-50 hover:to-violet-50 hover:border-indigo-200 transition-all duration-200 card-hover"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-violet-700 border border-violet-200">
                          {b.programme?.examCategory?.replace("_", " ")}
                        </span>
                        <span className="text-xs font-black text-slate-700">{enrolled}/{b.capacity}</span>
                      </div>
                      <div className="text-sm font-black text-slate-900">{b.name}</div>
                      {b.schedule && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{b.schedule}</span>
                        </div>
                      )}
                      <div className="mt-3">
                        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${fillPct}%`, background: barColor }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>{fillPct}% filled</span>
                          <span>{b.roomNumber ? `Room ${b.roomNumber}` : "No room set"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="anim-fade-up-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Megaphone className="w-3.5 h-3.5 text-pink-600" />
                </div>
                Announcements
              </h3>
              <Link href="/announcements" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold">Post new →</Link>
            </div>

            <div className="mt-4 space-y-3 flex-1">
              {announcements.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <Megaphone className="w-7 h-7 text-slate-300" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">No announcements yet.</p>
                  <Link href="/announcements" className="text-xs text-indigo-600 hover:underline mt-1 inline-block font-semibold">Post one →</Link>
                </div>
              ) : (
                announcements.map((a: any, i: number) => (
                  <div key={a.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white hover:from-pink-50 hover:to-rose-50 hover:border-pink-100 transition-all duration-200"
                  >
                    <div className="text-xs font-black text-slate-900">{a.title}</div>
                    <div className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">{a.content}</div>
                    <div className="mt-2 text-[10px] text-slate-400 font-medium">{formatDate(a.createdAt)}</div>
                  </div>
                ))
              )}
            </div>

            {announcements.length > 0 && (
              <Link
                href="/announcements"
                className="mt-4 pt-3 border-t border-slate-100 text-xs text-indigo-600 font-bold flex items-center justify-center gap-1 hover:gap-2 transition-all"
              >
                All announcements <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* ── Recent Students Table ── */}
        <div className="anim-fade-up-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                Recently Enrolled
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">Newest registrations this session</p>
            </div>
            <Link href="/students" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold">All students →</Link>
          </div>

          <div className="mt-3 overflow-x-auto">
            {recentStudents.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-xs font-semibold text-slate-500">No students enrolled yet.</p>
                <Link href="/students" className="text-xs text-indigo-600 hover:underline mt-1 inline-block font-semibold">Enroll the first student →</Link>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-black text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3">Student</th>
                    <th className="py-3 px-3">Reg. No</th>
                    <th className="py-3 px-3">Target</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Guardian</th>
                    <th className="py-3 px-3">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentStudents.map((s: any) => (
                    <tr key={s.id} className="hover:bg-indigo-50/50 transition-colors group">
                      <td className="py-3 px-3">
                        <div className="font-black text-slate-900 group-hover:text-indigo-800">{s.user?.fullName}</div>
                        <div className="text-[11px] font-normal text-slate-400">{s.user?.email}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-600">{s.registrationNumber}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {s.targetExam?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {s.enrollments?.[0]?.classBatch?.name || <span className="text-slate-300 italic font-normal">Not assigned</span>}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-700">{s.guardianName || "—"}</div>
                        <div className="text-[11px] text-slate-400">{s.guardianPhone || ""}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium">{formatDate(s.enrollmentDate)}</td>
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
