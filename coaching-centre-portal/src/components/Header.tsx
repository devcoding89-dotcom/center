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
    <header className="h-14 border-b border-zinc-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            type="button"
            className="md:hidden p-1.5 -ml-1 text-zinc-600 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors focus:outline-hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-zinc-950 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-zinc-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Academic Session Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
          <span>{academicSession}</span>
        </div>

        {/* Notifications Button */}
        <button
          title="Notifications"
          type="button"
          className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors border border-zinc-200/80"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
