"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Megaphone, Plus, Pin } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AnnouncementsPage() {
  const [items, setItems] = useState([
    {
      id: "1",
      title: "StudyMate CBT Practice Sessions are Live!",
      content:
        "All registered Good Coaching Centre candidates can now launch StudyMate directly from their dashboard to practice JAMB past questions and receive AI tutoring. No separate subscription is required.",
      audience: "ALL",
      pinned: true,
      date: new Date(),
    },
    {
      id: "2",
      title: "Saturday Diagnostic Mock Test",
      content:
        "Full simulation test starts Saturday at 9:00 AM sharp in Hall A1. Check your timetable for seat number allocations.",
      audience: "STUDENTS",
      pinned: false,
      date: new Date(),
    },
  ]);

  return (
    <DashboardLayout
      headerTitle="Broadcast Announcements"
      headerSubtitle="Publish urgent notices, exam schedules, and holiday broadcasts to students and tutors"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Notice Board
            </h2>
            <p className="text-xs text-slate-500">
              {items.length} active broadcast messages
            </p>
          </div>
          <button className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Announcement</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-lg border transition-colors ${
                item.pinned
                  ? "bg-white border-blue-300 shadow-xs"
                  : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.pinned && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                      <Pin className="w-3 h-3" />
                      <span>Pinned</span>
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-900">
                    {item.title}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDate(item.date)}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
