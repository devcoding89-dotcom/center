"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Sparkles, ShieldCheck, Key, ArrowRight, ExternalLink } from "lucide-react";

export default function TutorialCollegeIntegrationPage() {
  return (
    <DashboardLayout
      headerTitle="Tutorial College Integration"
      headerSubtitle="Dedicated configuration for embedded CBT practice, JAMB questions, and AI tutoring"
    >
      <div className="max-w-4xl space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-900/50 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Tutorial College Embedded Experience
                </h3>
                <p className="text-xs text-zinc-400">
                  Scheduled for Phase 5 implementation
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Architecture Ready
            </span>
          </div>

          <p className="mt-4 text-xs text-zinc-300 leading-relaxed">
            As outlined in the Master Integration Blueprint, this module enables single-use, short-lived launch-code exchange with your existing production Tutorial College deployment. Students access CBT past questions and AI tutoring directly within their portal without a second login.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs">
              <span className="text-zinc-500 text-[10px] uppercase font-semibold">
                Architecture Rule
              </span>
              <div className="text-zinc-200 font-semibold mt-1">
                Zero Code Duplication
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                One shared Tutorial College deployment serves all subscribed centres.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs">
              <span className="text-zinc-500 text-[10px] uppercase font-semibold">
                Authentication
              </span>
              <div className="text-zinc-200 font-semibold mt-1">
                Single-Use Launch Code
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Strict origin validation, no API keys exposed to browser code.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs">
              <span className="text-zinc-500 text-[10px] uppercase font-semibold">
                Entitlement Engine
              </span>
              <div className="text-zinc-200 font-semibold mt-1">
                Per-Student Access
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Centres selectively grant, renew, or suspend CBT access.
              </p>
            </div>
          </div>
        </div>

        {/* Integration Credentials Setup (Mocked for Phase 5 readiness) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Connection Configuration
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Link this centre to your central Tutorial College platform API
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300">
                Tutorial College Deployment URL
              </label>
              <input
                type="text"
                disabled
                value="https://tutorialcollege.ng/api/v1/integrations"
                className="mt-1 block w-full rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-zinc-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300">
                Centre API Key
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="password"
                  disabled
                  value="tc_live_sec_892348923094820934"
                  className="block w-full rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-zinc-500 font-mono"
                />
                <button
                  disabled
                  className="px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed text-xs"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
