"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Clock } from "lucide-react";

export default function TimetablePage() {
  const periods = [
    {
      time: "08:30 AM - 10:00 AM",
      subject: "Use of English",
      tutor: "Mrs. Akindele",
      room: "Hall A1",
      batch: "JAMB Morning Alpha",
    },
    {
      time: "10:15 AM - 11:45 AM",
      subject: "General Mathematics",
      tutor: "Mr. Samuel Okon",
      room: "Hall A1",
      batch: "JAMB Morning Alpha",
    },
    {
      time: "12:00 PM - 01:30 PM",
      subject: "Physics",
      tutor: "Mr. Samuel Okon",
      room: "Hall A1",
      batch: "JAMB Morning Alpha",
    },
  ];

  return (
    <DashboardLayout
      headerTitle="Class Timetable"
      headerSubtitle="Master lecture schedule, subject allocations, and classroom assignment"
    >
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Weekly Schedule View
            </h3>
            <span className="text-xs text-slate-500 font-medium">JAMB Morning Alpha Batch</span>
          </div>

          <div className="mt-5 space-y-3">
            {periods.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-white border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                    P{idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {p.subject}
                    </div>
                    <div className="text-xs text-slate-500">
                      Tutor: {p.tutor} • Venue: {p.room}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{p.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
