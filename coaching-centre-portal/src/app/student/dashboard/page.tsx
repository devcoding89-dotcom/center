"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StudentLayout } from "@/components/StudentLayout";
import {
  CalendarCheck,
  CreditCard,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Sparkles,
  ExternalLink,
  Users,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import { formatNaira, formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [launchingSso, setLaunchingSso] = useState(false);
  const [ssoModalData, setSsoModalData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/student/me");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLaunchStudyMate = async () => {
    setLaunchingSso(true);
    try {
      const res = await fetch("/api/sso/launch", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        setSsoModalData(json);
      }
    } catch (e) {
      console.error("SSO launch error:", e);
    } finally {
      setLaunchingSso(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-28 bg-slate-200 rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-32 bg-slate-200 rounded-lg"></div>
            <div className="h-32 bg-slate-200 rounded-lg"></div>
            <div className="h-32 bg-slate-200 rounded-lg"></div>
            <div className="h-32 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-44 bg-slate-200 rounded-lg"></div>
        </div>
      </StudentLayout>
    );
  }

  const {
    user,
    centre,
    profile,
    enrolledBatch,
    timetable = [],
    attendance,
    finance,
    announcements = [],
    studyMateEntitlement,
  } = data || {};

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayIndex = new Date().getDay();
  const currentDayName = days[currentDayIndex];

  // Classes scheduled for today
  const todaysClasses = timetable.filter(
    (slot: any) =>
      slot.dayOfWeek === currentDayIndex ||
      (currentDayIndex === 0 && slot.dayOfWeek === 1) // preview Monday if Sunday
  );

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* ---------------- WELCOME BANNER ---------------- */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Student Self-Service Portal
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-blue-700">
                {centre?.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Good day, {user?.fullName?.split(" ")[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Targeting: <strong className="text-slate-900">{profile?.targetCourse || "University Admission"}</strong> at{" "}
              <strong className="text-slate-900">{profile?.targetInstitution || "University of Choice"}</strong>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs md:text-right shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-500">Candidate Reg No</div>
            <div className="font-mono font-extrabold text-slate-950 text-sm mt-0.5">
              {profile?.registrationNumber || "GCC-2026-001"}
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">
              Batch: {enrolledBatch?.name || "General Batch"}
            </div>
          </div>
        </div>

        {/* ---------------- 4 DASHBOARD KPI CARDS ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CARD 1: ATTENDANCE */}
          <Link
            href="/student/attendance"
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-blue-400 transition-colors flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">My Attendance</span>
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-950">
                {attendance?.rate || 100}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {attendance?.presentCount ?? 1} attended · {attendance?.absentCount ?? 0} missed
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-700 group-hover:underline flex items-center gap-1">
              <span>View Attendance Log</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* CARD 2: MY FEES */}
          <Link
            href="/student/fees"
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-blue-400 transition-colors flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">My Fees Status</span>
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-950">
                {formatNaira(finance?.balanceDue || 0)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Paid: {formatNaira(finance?.totalPaid || 0)} of {formatNaira(finance?.totalBilled || 0)}
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-700 group-hover:underline flex items-center gap-1">
              <span>View Receipts &amp; Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* CARD 3: MY CLASS */}
          <Link
            href="/student/timetable"
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-blue-400 transition-colors flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">My Class &amp; Stream</span>
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-800 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-950 truncate">
                {enrolledBatch?.name || "Regular Stream"}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Prog: {enrolledBatch?.programme?.name || "JAMB Comprehensive"}
              </p>
            </div>
            <div className="text-[11px] font-bold text-blue-700 group-hover:underline flex items-center gap-1">
              <span>Class Schedule</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* CARD 4: STUDYMATE SHORTCUT */}
          <div className="bg-blue-700 text-white rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                StudyMate CBT
              </span>
              <Sparkles className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white">
                Exam Simulator Active
              </div>
              <p className="text-xs text-blue-100 mt-1">
                Full CBT mock tests &amp; AI diagnostics included.
              </p>
            </div>
            <button
              onClick={handleLaunchStudyMate}
              disabled={launchingSso}
              className="w-full py-2 px-3 rounded bg-black hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              {launchingSso ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Launch StudyMate</span>
                  <ExternalLink className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ---------------- TODAY'S SCHEDULE & ANNOUNCEMENTS GRID ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Today's Classes */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                  Upcoming Classes ({currentDayName})
                </h2>
              </div>
              <Link
                href="/student/timetable"
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                Full Weekly Timetable →
              </Link>
            </div>

            {todaysClasses.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-md p-6 text-center text-xs text-slate-500">
                No lecture sessions scheduled for today ({currentDayName}). Review your weekly timetable for upcoming classes.
              </div>
            ) : (
              <div className="space-y-3">
                {todaysClasses.map((slot: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition-colors gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">
                          {slot.subject?.name || "Subject Lecture"}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                          {slot.venue || "Hall A1"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Instructor: {slot.teacherName || "Assigned Teacher"}
                      </div>
                    </div>

                    <div className="text-xs font-mono font-bold text-slate-700 sm:text-right">
                      {slot.startTime} – {slot.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Col: Centre Announcements */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                  Notice Board
                </h2>
              </div>
              <Link
                href="/student/announcements"
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                All →
              </Link>
            </div>

            {announcements.length === 0 ? (
              <p className="text-xs text-slate-500">No active announcements posted.</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 3).map((ann: any) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1"
                  >
                    <div className="font-bold text-xs text-slate-900 line-clamp-1">
                      {ann.title}
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {ann.content}
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1">
                      {formatDate(ann.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- STUDYMATE SSO MODAL ---------------- */}
      {ssoModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-lg w-full max-w-md p-6 shadow-xl relative animate-fade-in">
            <div className="flex items-center gap-2.5 text-blue-700">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-950">
                Connecting to StudyMate
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Secure single sign-on authenticated for {centre?.name}.
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
                <span>Access Plan:</span>
                <span>Fully Covered by Centre</span>
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
    </StudentLayout>
  );
}
