"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldLogo } from "@/components/ShieldLogo";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Clock,
  Megaphone,
  Settings,
  LogOut,
  Layers,
  BookOpen,
  LucideIcon,
  BarChart3,
  UserCheck,
  X,
} from "lucide-react";

interface NavLinkItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface SidebarProps {
  user?: {
    fullName: string;
    email: string;
    isSuperAdmin: boolean;
  };
  activeCentre?: {
    id: string;
    name: string;
    slug: string;
    role: string;
  };
  allMemberships?: any[];
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ user, activeCentre, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const isStudent = activeCentre?.role === "STUDENT";

  // Centre Owner Navigation
  const ownerNavLinks: NavLinkItem[] = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "StudyMate Insights", href: "/dashboard/studymate-insights", icon: BarChart3, badge: "CBT" },
    { label: "Students", href: "/students", icon: Users },
    { label: "Staff Members", href: "/staff", icon: UserCheck },
    { label: "Classes & Batches", href: "/batches", icon: Layers },
    { label: "Attendance Roll-Call", href: "/attendance", icon: CalendarCheck },
    { label: "Accounting & Fees", href: "/finance", icon: CreditCard, badge: "Finance" },
    { label: "Timetable", href: "/timetable", icon: Clock },
    { label: "Announcements", href: "/announcements", icon: Megaphone },
    { label: "Centre Settings", href: "/settings", icon: Settings },
  ];

  // Student Navigation
  const studentNavLinks: NavLinkItem[] = [
    { label: "My Student Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Timetable", href: "/timetable", icon: Clock },
    { label: "Attendance Record", href: "/attendance", icon: CalendarCheck },
    { label: "Tuition & Receipts", href: "/finance", icon: CreditCard },
    { label: "Announcements", href: "/announcements", icon: Megaphone },
  ];

  const navLinks = isStudent ? studentNavLinks : ownerNavLinks;

  const renderContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <ShieldLogo size="sm" href={isStudent ? "/student/dashboard" : "/dashboard"} />
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Pill */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
        <div className="px-2.5 py-1 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Portal:</span>
          <span className="text-slate-950 font-bold truncate ml-1">
            {isStudent ? "STUDENT" : (activeCentre?.name || "CENTRE ADMIN")}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
          {isStudent ? "Student Services" : "Centre Management & Accounting"}
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                if (isMobile && onClose) onClose();
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-700 hover:text-black hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span className="truncate">{link.label}</span>
              </div>
              {link.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ml-1.5 ${
                    isActive
                      ? "bg-blue-800 text-white"
                      : "bg-slate-100 text-blue-700 border border-slate-200"
                  }`}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* StudyMate Launch Pill for Students */}
        {isStudent && (
          <div className="pt-4 mt-2 border-t border-slate-200">
            <a
              href="/api/sso/launch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-xs font-bold shadow-xs"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>StudyMate CBT</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 text-white font-mono">
                1-CLICK
              </span>
            </a>
          </div>
        )}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
          <div className="truncate pr-2 min-w-0">
            <div className="text-xs font-bold text-black truncate">
              {user?.fullName || "User"}
            </div>
            <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex w-64 min-h-screen flex-col border-r border-slate-200 shrink-0 sticky top-0 h-screen">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-4/5 max-w-xs h-full z-10 shadow-2xl">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
