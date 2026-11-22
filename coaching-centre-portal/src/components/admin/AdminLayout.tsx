"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldLogo } from "@/components/ShieldLogo";
import {
  LayoutDashboard,
  Building2,
  CheckCircle2,
  Clock,
  Ban,
  Package,
  CreditCard,
  TrendingUp,
  Users,
  ShieldAlert,
  Cpu,
  Radio,
  LifeBuoy,
  Megaphone,
  History,
  Activity,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function AdminLayout({
  children,
  headerTitle,
  headerSubtitle,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (!data.user?.isSuperAdmin) {
          router.push("/dashboard");
          return;
        }
        setAdminUser(data.user);
      } catch (err) {
        console.error("Super Admin auth check failed:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const navGroups = [
    {
      group: "OVERVIEW",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      group: "CENTRES",
      items: [
        { label: "All Centres", href: "/admin/centres", icon: Building2 },
        { label: "Pending Approvals", href: "/admin/centres?status=PENDING", icon: Clock },
        { label: "Active Centres", href: "/admin/centres?status=ACTIVE", icon: CheckCircle2 },
        { label: "Suspended Centres", href: "/admin/centres?status=SUSPENDED", icon: Ban },
      ],
    },
    {
      group: "BUSINESS",
      items: [
        { label: "Subscription Plans", href: "/admin/subscriptions", icon: Package },
        { label: "SaaS Payments", href: "/admin/revenue", icon: CreditCard },
      ],
    },
    {
      group: "USERS",
      items: [
        { label: "Platform Users", href: "/admin/users", icon: Users },
      ],
    },
    {
      group: "INTEGRATIONS",
      items: [
        { label: "StudyMate Telemetry", href: "/admin/integrations", icon: Cpu },
      ],
    },
    {
      group: "SUPPORT",
      items: [
        { label: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
        { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
      ],
    },
    {
      group: "SYSTEM",
      items: [
        { label: "Audit & Health", href: "/admin/system", icon: Activity },
        { label: "Platform Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">Verifying Super Admin clearance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-64 bg-slate-950 text-slate-300 flex-col shrink-0 border-r border-slate-800 select-none">
        {/* Brand Banner */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800 gap-3">
          <ShieldLogo size="sm" showText={false} />
          <div>
            <div className="text-xs font-black tracking-wider uppercase text-white">
              Super Admin
            </div>
            <div className="text-[10px] text-blue-400 font-semibold tracking-wide">
              SaaS Control Centre
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href.split("?")[0]));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs font-bold"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between p-2 rounded bg-slate-900/60">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-bold text-white truncate">
                {adminUser?.fullName || "Administrator"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {adminUser?.email || "admin@stoics.ng"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-slate-950 tracking-tight">
                {headerTitle || "Platform Super Admin Console"}
              </h1>
              {headerSubtitle && (
                <p className="text-[11px] text-slate-500 font-medium">
                  {headerSubtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Platform Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-700" />
              <span>Multi-Tenant Online</span>
            </div>

            {/* Quick Link to Landing Page */}
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-700 px-2.5 py-1.5 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <span>Public Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-red-600 px-2.5 py-1.5 rounded border border-slate-200 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* ================= MOBILE SLIDE-OVER DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-72 max-w-[80vw] bg-slate-950 text-slate-300 flex flex-col h-full z-10 shadow-xl">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldLogo size="sm" showText={false} />
                <span className="text-xs font-black tracking-wider uppercase text-white">
                  Super Admin
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1">
                  <div className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    {group.group}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900"
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
