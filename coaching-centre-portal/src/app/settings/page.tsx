"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout
      headerTitle="Centre Settings"
      headerSubtitle="Configure institutional profile, academic session, branding, and subscription"
    >
      <div className="max-w-3xl space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Institutional Profile
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Details printed on student invoices, payment receipts, and roll-call records
          </p>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700">
                  Centre Name
                </label>
                <input
                  type="text"
                  defaultValue="Good Coaching Centre"
                  className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">
                  Academic Session
                </label>
                <input
                  type="text"
                  defaultValue="2026/2027"
                  className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700">
                  State
                </label>
                <input
                  type="text"
                  defaultValue="Lagos State"
                  className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">
                  City / Town
                </label>
                <input
                  type="text"
                  defaultValue="Yaba"
                  className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2">
              <button className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Plan Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Centre Platform Subscription
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current Plan: <span className="font-semibold text-slate-800">STANDARD (₦10,000 / month)</span>
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              ACTIVE
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Covers centre management, student rosters, and bundled StudyMate CBT practice access for all enrolled students.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
