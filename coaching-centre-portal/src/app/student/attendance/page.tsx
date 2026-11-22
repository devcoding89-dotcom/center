"use client";

import React, { useEffect, useState } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentAttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("November 2026");

  useEffect(() => {
    async function loadAttendance() {
      try {
        const res = await fetch("/api/student/me");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  if (loading) {
    return (
      <StudentLayout headerTitle="My Attendance Log" headerSubtitle="Official roll-call records and monthly attendance percentage">
        <div className="h-64 bg-slate-200 rounded-lg animate-pulse"></div>
      </StudentLayout>
    );
  }

  const { attendance, enrolledBatch } = data || {};

  // Sample calendar days for November 2026
  const calendarDays = [
    { day: 2, status: "PRESENT", topic: "Newtonian Mechanics (Physics)" },
    { day: 3, status: "PRESENT", topic: "Organic Chemistry: Functional Groups" },
    { day: 4, status: "PRESENT", topic: "Calculus & Derivatives (Mathematics)" },
    { day: 5, status: "LATE", topic: "English Comprehension & Lexis" },
    { day: 6, status: "PRESENT", topic: "Cellular Respiration (Biology)" },
    { day: 9, status: "PRESENT", topic: "Thermodynamics & Heat Capacity" },
    { day: 10, status: "PRESENT", topic: "Stoichiometry Calculations" },
    { day: 11, status: "ABSENT", topic: "Vectors and Scalars in 3D" },
    { day: 12, status: "PRESENT", topic: "Past Question Speed Drill" },
    { day: 13, status: "PRESENT", topic: "Genetics & Inheritance Patterns" },
    { day: 16, status: "PRESENT", topic: "Electromagnetism & Faraday's Law" },
    { day: 17, status: "PRESENT", topic: "Equilibrium & Le Chatelier" },
    { day: 18, status: "PRESENT", topic: "JAMB UTME Timed Mock Test" },
    { day: 19, status: "PRESENT", topic: "Essay Structure & Oral English" },
    { day: 20, status: "PRESENT", topic: "Ecology and Biomes in Nigeria" },
  ];

  return (
    <StudentLayout
      headerTitle="My Attendance Log"
      headerSubtitle="Institutional roll-call records, monthly attendance rate and absence tracking"
    >
      <div className="space-y-6">
        {/* ---------------- ATTENDANCE KPI ROW ---------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Attendance Rate</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
              {attendance?.rate || 93}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Required minimum: 80%</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Classes Attended</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              14
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Present / Punctual</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Late Arrivals</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              1
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Arrived after roll-call</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Classes Missed</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">
              1
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Unexcused absence</p>
          </div>
        </div>

        {/* ---------------- MONTHLY CALENDAR CARD ---------------- */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                Monthly Roll-Call Calendar
              </h2>
              <p className="text-xs text-slate-500">
                Stream: <strong className="text-slate-900">{enrolledBatch?.name || "Morning Alpha"}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-700"
              >
                <option>November 2026</option>
                <option>October 2026</option>
                <option>September 2026</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>Late</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              <span>No Class / Weekend</span>
            </div>
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {calendarDays.map((record, i) => {
              const isPresent = record.status === "PRESENT";
              const isLate = record.status === "LATE";
              const isAbsent = record.status === "ABSENT";

              return (
                <div
                  key={i}
                  className={`p-3 rounded border text-xs space-y-1.5 transition-colors ${
                    isPresent
                      ? "border-emerald-200 bg-emerald-50/50 text-slate-900"
                      : isLate
                      ? "border-amber-200 bg-amber-50/60 text-slate-900"
                      : "border-red-200 bg-red-50/60 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm">Nov {record.day}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isPresent
                          ? "bg-emerald-100 text-emerald-800"
                          : isLate
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                    {record.topic}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- ATTENDANCE POLICY NOTICE ---------------- */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 text-xs text-slate-600 space-y-1 leading-relaxed">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Attendance Policy &amp; Exam Clearance</span>
          </div>
          <p>
            Coaching centre candidates are required to maintain a minimum of 80% attendance to receive mock examination clearance and official certificate of attendance. For queries regarding an unrecorded session, submit a ticket via the Support Desk.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}
