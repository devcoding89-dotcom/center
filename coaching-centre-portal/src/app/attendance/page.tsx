"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CalendarCheck, CheckCircle2 } from "lucide-react";

export default function AttendancePage() {
  const [selectedBatch, setSelectedBatch] = useState("JAMB Morning Alpha Batch");
  const [marked, setMarked] = useState(false);

  const studentsList = [
    { id: "1", name: "Chinedu Eze", regNo: "GCC/2026/001", status: "PRESENT" },
    { id: "2", name: "Amina Bello", regNo: "GCC/2026/002", status: "PRESENT" },
    { id: "3", name: "Damilola Bakare", regNo: "GCC/2026/003", status: "LATE" },
  ];

  const [statuses, setStatuses] = useState<Record<string, string>>({
    "1": "PRESENT",
    "2": "PRESENT",
    "3": "LATE",
  });

  const toggleStatus = (id: string, s: string) => {
    setStatuses((prev) => ({ ...prev, [id]: s }));
  };

  return (
    <DashboardLayout
      headerTitle="Attendance Roll-Call"
      headerSubtitle="Record lecture attendance, morning roll-call, and monitor student absenteeism"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <div className="flex items-center gap-3">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 font-medium"
            >
              <option>JAMB Morning Alpha Batch</option>
              <option>WAEC Weekend Intensive</option>
            </select>
            <span className="text-xs text-slate-500">Date: Today ({new Date().toLocaleDateString("en-GB")})</span>
          </div>

          <button
            onClick={() => setMarked(true)}
            className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{marked ? "Attendance Saved ✓" : "Save Roll-Call"}</span>
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Reg Number</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsList.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {s.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{s.regNo}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        statuses[s.id] === "PRESENT"
                          ? "bg-slate-900 text-white border-slate-900"
                          : statuses[s.id] === "LATE"
                          ? "bg-blue-50 text-blue-900 border-blue-200"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {statuses[s.id]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => toggleStatus(s.id, "PRESENT")}
                      className={`px-2.5 py-1 rounded text-xs font-bold border ${
                        statuses[s.id] === "PRESENT"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "border-slate-300 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => toggleStatus(s.id, "LATE")}
                      className={`px-2.5 py-1 rounded text-xs font-bold border ${
                        statuses[s.id] === "LATE"
                          ? "bg-blue-700 text-white border-blue-700"
                          : "border-slate-300 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Late
                    </button>
                    <button
                      onClick={() => toggleStatus(s.id, "ABSENT")}
                      className={`px-2.5 py-1 rounded text-xs font-bold border ${
                        statuses[s.id] === "ABSENT"
                          ? "bg-slate-300 text-slate-900 border-slate-400 font-extrabold"
                          : "border-slate-300 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
