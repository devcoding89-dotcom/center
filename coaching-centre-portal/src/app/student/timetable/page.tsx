"use client";

import React, { useEffect, useState } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import {
  Clock,
  Calendar,
  BookOpen,
  MapPin,
  User,
  Layers,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function StudentTimetablePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | "ALL">("ALL");

  useEffect(() => {
    async function loadTimetable() {
      try {
        const res = await fetch("/api/student/me");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTimetable();
  }, []);

  if (loading) {
    return (
      <StudentLayout headerTitle="Weekly Timetable" headerSubtitle="Scheduled lecture periods, subject teachers and venue allocations">
        <div className="h-64 bg-slate-200 rounded-lg animate-pulse"></div>
      </StudentLayout>
    );
  }

  const { enrolledBatch, timetable = [] } = data || {};

  const daysOfWeek = [
    { index: 1, name: "Monday" },
    { index: 2, name: "Tuesday" },
    { index: 3, name: "Wednesday" },
    { index: 4, name: "Thursday" },
    { index: 5, name: "Friday" },
    { index: 6, name: "Saturday" },
  ];

  const currentDayIndex = new Date().getDay();

  // Filter slots
  const displayedSlots =
    selectedDay === "ALL"
      ? timetable
      : timetable.filter((slot: any) => slot.dayOfWeek === selectedDay);

  // Group by day for weekly view
  const groupedByDay = daysOfWeek.map((day) => ({
    ...day,
    isToday: day.index === currentDayIndex,
    slots: timetable.filter((slot: any) => slot.dayOfWeek === day.index),
  }));

  return (
    <StudentLayout
      headerTitle="Weekly Timetable"
      headerSubtitle="Scheduled lecture sessions, subjects, venues and teachers"
    >
      <div className="space-y-6">
        {/* Stream Banner */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Lecture Batch
            </span>
            <h2 className="text-xl font-extrabold text-slate-950">
              {enrolledBatch?.name || "JAMB Morning Alpha"}
            </h2>
            <p className="text-xs text-slate-600">
              Programme: <strong className="text-slate-900">{enrolledBatch?.programme?.name || "JAMB Intensive Masterclass"}</strong>
            </p>
          </div>

          {/* Filter Day tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setSelectedDay("ALL")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                selectedDay === "ALL"
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:text-black"
              }`}
            >
              Full Week
            </button>
            {daysOfWeek.map((day) => (
              <button
                key={day.index}
                onClick={() => setSelectedDay(day.index)}
                className={`px-2.5 py-1.5 rounded text-xs font-bold transition-colors ${
                  selectedDay === day.index
                    ? "bg-blue-700 text-white"
                    : "text-slate-700 hover:text-black"
                }`}
              >
                {day.name.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- WEEKLY SCHEDULE ---------------- */}
        {selectedDay === "ALL" ? (
          <div className="space-y-6">
            {groupedByDay.map((day) => (
              <div
                key={day.index}
                className={`bg-white border rounded-lg p-5 sm:p-6 shadow-xs space-y-4 transition-colors ${
                  day.isToday ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-950">{day.name}</h3>
                    {day.isToday && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-700 text-white">
                        Today's Schedule
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {day.slots.length} {day.slots.length === 1 ? "Session" : "Sessions"}
                  </span>
                </div>

                {day.slots.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400 italic">
                    No lecture sessions scheduled for {day.name}.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {day.slots.map((slot: any) => (
                      <div
                        key={slot.id}
                        className="p-3.5 rounded border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="font-extrabold text-xs text-slate-900">
                            {slot.subject?.name || "General Lecture"}
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{slot.teacherName || "Assigned Teacher"}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{slot.venue || "Hall A1 (Main Building)"}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-1 rounded bg-slate-200/80 font-mono font-bold text-[11px] text-slate-800">
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Filtered Single Day View */
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-950">
              {daysOfWeek.find((d) => d.index === selectedDay)?.name} Lecture Sessions
            </h3>

            {displayedSlots.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No classes scheduled for this day.
              </div>
            ) : (
              <div className="space-y-3">
                {displayedSlots.map((slot: any) => (
                  <div
                    key={slot.id}
                    className="p-4 rounded border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-extrabold text-sm text-slate-950">
                        {slot.subject?.name}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Instructor: {slot.teacherName} • Venue: {slot.venue}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-xs bg-slate-200 px-3 py-1.5 rounded text-slate-900">
                      {slot.startTime} – {slot.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
