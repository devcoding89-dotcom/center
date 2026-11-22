"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  academicSession?: string;
  onMenuClick?: () => void;
}

export function Header({
  title = "Overview",
  subtitle,
  academicSession = "2026/2027 Session",
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            type="button"
            className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Academic Session Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{academicSession}</span>
        </div>

        {/* Notifications Button */}
        <button
          title="Notifications"
          type="button"
          className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
