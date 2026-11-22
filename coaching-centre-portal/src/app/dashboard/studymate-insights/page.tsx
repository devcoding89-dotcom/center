"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  BarChart3,
  TrendingUp,
} from "lucide-react";

export default function StudyMateInsightsPage() {
  const subjectAverages = [
    { subject: "Use of English", attempts: 184, avgScore: "72%", status: "Good" },
    { subject: "General Mathematics", attempts: 142, avgScore: "64%", status: "Average" },
    { subject: "Physics", attempts: 98, avgScore: "58%", status: "Needs Support" },
    { subject: "Chemistry", attempts: 110, avgScore: "68%", status: "Average" },
    { subject: "Biology", attempts: 85, avgScore: "76%", status: "Good" },
    { subject: "Economics", attempts: 54, avgScore: "70%", status: "Good" },
  ];

  const weakTopics = [
    {
      topic: "Calculus: Definite & Indefinite Integration",
      subject: "Mathematics",
      accuracy: "34%",
      studentsAffected: 28,
      recommendation: "Schedule a dedicated 2-hour problem-solving masterclass.",
    },
    {
      topic: "Organic Chemistry: IUPAC Nomenclature of Isomers",
      subject: "Chemistry",
      accuracy: "41%",
      studentsAffected: 22,
      recommendation: "Provide reaction charts and functional group worksheets.",
    },
    {
      topic: "Newtonian Mechanics: Projectile Motion at an Angle",
      subject: "Physics",
      accuracy: "44%",
      studentsAffected: 25,
      recommendation: "Conduct physical demonstration with formula derivations.",
    },
  ];

  return (
    <DashboardLayout
      headerTitle="StudyMate Learning Insights"
      headerSubtitle="Aggregate CBT exam performance, weak-topic analytics, and revision recommendations"
    >
      <div className="space-y-6">
        {/* Institutional Header Banner */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Institutional Learning Analytics Feed
              </h2>
              <p className="text-xs text-slate-500">
                Data synchronized from StudyMate CBT practice engine for Good Coaching Centre
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Active Feed
          </span>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Students with Access
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              42 Enrolled
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Included in centre subscription
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Active Learners
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              38 Active
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Practiced in last 7 days</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500">
              CBT Questions Solved
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              673 Questions
            </div>
            <div className="text-[11px] text-slate-500 mt-1">JAMB & WAEC syllabi</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Centre Average Score
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              68.4%
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              ↑ +4.2% from diagnostic baseline
            </div>
          </div>
        </div>

        {/* Identified Weak Topics */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Weak Topics Requiring Classroom Revision
              </h3>
              <p className="text-xs text-slate-500">
                Syllabus topics where student accuracy fell below 50% during recent CBT sessions
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {weakTopics.map((w, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {w.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {w.topic}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Recommendation: <span className="font-medium text-slate-800">{w.recommendation}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-rose-700">
                    {w.accuracy} Accuracy
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {w.studentsAffected} students affected
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance Breakdown Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Subject CBT Performance Breakdown
            </h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Questions Attempted</th>
                <th className="py-2.5 px-4">Centre Average Score</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectAverages.map((s) => (
                <tr key={s.subject} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-semibold text-slate-900">
                    {s.subject}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    {s.attempts} attempts
                  </td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    {s.avgScore}
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        s.status === "Good"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : s.status === "Average"
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {s.status}
                    </span>
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
