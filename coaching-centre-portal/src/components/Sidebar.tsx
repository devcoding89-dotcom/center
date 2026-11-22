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
    { label: "Accounting & Fees", href: "/finance", icon: CreditCard },
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
    <div className="flex flex-col h-full bg-white text-zinc-900 border-r border-zinc-200">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-200/80 flex items-center justify-between">
        <ShieldLogo size="sm" href={isStudent ? "/student/dashboard" : "/dashboard"} />
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-md hover:bg-zinc-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Role / Centre Info */}
      <div className="px-4 py-2.5 bg-zinc-50/70 border-b border-zinc-200/60 flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-medium text-[11px]">Workspace</span>
        <span className="text-zinc-900 font-semibold text-[11px] truncate ml-2">
          {isStudent ? "Student Portal" : (activeCentre?.name || "Centre Admin")}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-3 py-1.5">
          {isStudent ? "Services" : "Management"}
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
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-zinc-500"}`} />
                <span className="truncate">{link.label}</span>
              </div>
              {link.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold shrink-0 ml-1.5 ${
                    isActive
                      ? "bg-zinc-800 text-zinc-200"
                      : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                  }`}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* StudyMate Button for Students */}
        {isStudent && (
          <div className="pt-3 mt-2 border-t border-zinc-200/60">
            <a
              href="/api/sso/launch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors text-xs font-medium shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-300" />
                <span>StudyMate CBT</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                Launch
              </span>
            </a>
          </div>
        )}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-zinc-200 bg-zinc-50/50">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-zinc-200/80">
          <div className="truncate pr-2 min-w-0">
            <div className="text-xs font-semibold text-zinc-900 truncate">
              {user?.fullName || "User"}
            </div>
            <div className="text-[11px] text-zinc-500 truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen flex-col shrink-0 sticky top-0 h-screen">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-4/5 max-w-xs h-full z-10 shadow-xl">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
