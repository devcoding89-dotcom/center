"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Menu,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function DashboardLayout({
  children,
  headerTitle = "Dashboard",
  headerSubtitle,
}: DashboardLayoutProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Session load error", e);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-slate-600">Loading portal...</p>
      </div>
    );
  }

  if (!data?.authenticated) {
    return null;
  }

  const mobileNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/students", icon: Users },
    { label: "Attendance", href: "/attendance", icon: CalendarCheck },
    { label: "Finance", href: "/finance", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar with Desktop & Mobile Drawer mode */}
      <Sidebar
        user={data.user}
        activeCentre={data.activeCentre}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={headerTitle}
          subtitle={headerSubtitle || `Managing ${data.activeCentre?.name || "Centre"}`}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* ── Mobile Floating Bottom Navigation ── */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg"
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-lg transition-colors ${
                isActive ? "text-blue-600 font-extrabold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* More Button to trigger drawer */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          type="button"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
        >
          <Menu className="w-4 h-4 text-slate-400" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
