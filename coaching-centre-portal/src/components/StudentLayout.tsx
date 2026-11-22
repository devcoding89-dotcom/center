"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldLogo } from "@/components/ShieldLogo";
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  CreditCard,
  Clock,
  Megaphone,
  Bell,
  HelpCircle,
  LogOut,
  ExternalLink,
  Menu,
  X,
  BookOpen,
  Building,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface StudentLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function StudentLayout({
  children,
  headerTitle,
  headerSubtitle,
}: StudentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ssoModalData, setSsoModalData] = useState<any>(null);
  const [launchingSso, setLaunchingSso] = useState(false);

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const res = await fetch("/api/student/me");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.ok) {
          const json = await res.json();
          setStudentData(json);
        }
      } catch (err) {
        console.error("Failed to load student context:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const handleLaunchStudyMate = async () => {
    setLaunchingSso(true);
    try {
      const res = await fetch("/api/sso/launch", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        setSsoModalData(json);
      }
    } catch (e) {
      console.error("SSO launch failed", e);
    } finally {
      setLaunchingSso(false);
    }
  };

  const navLinks = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/student/profile", icon: User },
    { label: "My Attendance", href: "/student/attendance", icon: CalendarCheck },
    { label: "My Fees & Receipts", href: "/student/fees", icon: CreditCard },
    { label: "Weekly Timetable", href: "/student/timetable", icon: Clock },
    { label: "Announcements", href: "/student/announcements", icon: Megaphone },
    {
      label: "Notification Centre",
      href: "/student/notifications",
      icon: Bell,
      badge: studentData?.unreadNotificationCount > 0 ? studentData.unreadNotificationCount : undefined,
    },
    { label: "Support Desk", href: "/student/support", icon: HelpCircle },
  ];

  const centreName = studentData?.centre?.name || "Coaching Centre";
  const studentName = studentData?.user?.fullName || "Student";
  const regNo = studentData?.profile?.registrationNumber || "";
  const session = studentData?.centre?.session || "2026/2027";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      {/* ---------------- TOP HEADER ---------------- */}
      <header className="h-14 border-b border-zinc-200 bg-white sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-md text-zinc-600 hover:text-black hover:bg-zinc-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <ShieldLogo size="sm" href="/student/dashboard" showText={false} />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-zinc-950">
                {centreName}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                Student
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 font-medium">
              Session {session} {regNo && `• Reg: `}
              <span className="font-mono font-bold text-zinc-800">{regNo}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student/notifications"
            className="relative p-1.5 text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            title="Notification Alerts"
          >
            <Bell className="w-4 h-4" />
            {studentData?.unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
            )}
          </Link>

          <div className="hidden sm:block text-right pr-1">
            <div className="text-xs font-semibold text-zinc-900">{studentName}</div>
            <div className="text-[10px] text-zinc-500 font-medium">
              {studentData?.profile?.targetExam?.replace("_", " ") || "Candidate"}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-zinc-500 hover:text-zinc-950 rounded-md border border-zinc-200 hover:bg-zinc-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex w-full">
        {/* ---------------- DESKTOP SIDEBAR ---------------- */}
        <aside className="hidden md:flex w-64 bg-white border-r border-zinc-200 flex-col p-4 shrink-0 justify-between">
          <div className="space-y-6">
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs space-y-1">
              <div className="font-bold text-zinc-950 truncate">{studentName}</div>
              <div className="text-[11px] text-zinc-500 font-mono">{regNo || "Enrolled Student"}</div>
              <div className="text-[10px] font-semibold text-zinc-700 bg-zinc-200/70 px-2 py-0.5 rounded inline-block mt-1">
                {studentData?.enrolledBatch?.name || "Regular Batch"}
              </div>
            </div>

            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? "bg-zinc-900 text-white shadow-2xs"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-zinc-800 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-zinc-200">
            <div className="bg-zinc-900 text-white rounded-lg p-3.5 space-y-2 border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  Learning Engine
                </span>
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="font-bold text-xs text-white">StudyMate CBT &amp; AI</div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Timed mock exams, past questions &amp; AI diagnostics.
              </p>
              <button
                type="button"
                onClick={handleLaunchStudyMate}
                disabled={launchingSso}
                className="w-full py-2 px-3 rounded bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {launchingSso ? (
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Open StudyMate</span>
                    <ExternalLink className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* ---------------- MOBILE DRAWER MENU ---------------- */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-white h-full p-5 flex flex-col justify-between shadow-2xl z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="font-bold text-sm text-slate-900">{centreName}</div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded text-slate-500 hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded text-xs font-bold transition-colors ${
                          active
                            ? "bg-slate-900 text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLaunchStudyMate();
                  }}
                  className="w-full py-2.5 px-3 rounded bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Launch StudyMate</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MAIN CONTENT AREA ---------------- */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto pb-24 md:pb-10">
          {(headerTitle || headerSubtitle) && (
            <div className="mb-6">
              {headerTitle && (
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                  {headerTitle}
                </h1>
              )}
              {headerSubtitle && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {headerSubtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </main>
      </div>

      {/* ---------------- MOBILE FLOATING BOTTOM NAV ---------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <Link
          href="/student/dashboard"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            pathname === "/student/dashboard" ? "text-blue-700" : "text-slate-500"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/student/timetable"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            pathname === "/student/timetable" ? "text-blue-700" : "text-slate-500"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Classes</span>
        </Link>

        {/* Prominent StudyMate Center Action Button */}
        <button
          onClick={handleLaunchStudyMate}
          disabled={launchingSso}
          className="flex flex-col items-center justify-center -mt-4 bg-blue-700 text-white w-12 h-12 rounded-full shadow-md hover:bg-blue-800 transition-transform active:scale-95"
          title="Launch StudyMate CBT"
        >
          <BookOpen className="w-5 h-5" />
        </button>

        <Link
          href="/student/fees"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            pathname === "/student/fees" ? "text-blue-700" : "text-slate-500"
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Fees</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500"
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </div>

      {/* ---------------- STUDYMATE SSO MODAL ---------------- */}
      {ssoModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-lg w-full max-w-md p-6 shadow-xl relative animate-fade-in">
            <div className="flex items-center gap-2.5 text-blue-700">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-950">
                StudyMate Single Sign-On
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Secure learning session verified for {centreName}.
            </p>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">{ssoModalData.student?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reg No:</span>
                <span className="font-mono font-bold text-slate-900">{ssoModalData.student?.regNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Centre:</span>
                <span className="font-semibold text-slate-900">{ssoModalData.student?.centre}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px] text-blue-700 font-medium">
                <span>Access Status:</span>
                <span>Active (Sponsored by Centre)</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSsoModalData(null)}
                className="px-4 py-2 rounded border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <a
                href={ssoModalData.launchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSsoModalData(null)}
                className="px-5 py-2.5 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>Continue to StudyMate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
