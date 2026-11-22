"use client";

import React, { useState, useEffect } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import {
  Bell,
  CalendarCheck,
  CreditCard,
  Megaphone,
  Clock,
  CheckCircle2,
  Circle,
  CheckCheck,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  linkUrl?: string | null;
  isRead: boolean;
  createdAt: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  ATTENDANCE: <CalendarCheck className="h-5 w-5 text-teal-600" />,
  PAYMENT: <CreditCard className="h-5 w-5 text-amber-600" />,
  ANNOUNCEMENT: <Megaphone className="h-5 w-5 text-blue-600" />,
  TIMETABLE: <Clock className="h-5 w-5 text-purple-600" />,
  GENERAL: <Bell className="h-5 w-5 text-gray-500" />,
};

const typeBg: Record<string, string> = {
  ATTENDANCE: "bg-teal-50 border-teal-100",
  PAYMENT: "bg-amber-50 border-amber-100",
  ANNOUNCEMENT: "bg-blue-50 border-blue-100",
  TIMETABLE: "bg-purple-50 border-purple-100",
  GENERAL: "bg-gray-50 border-gray-100",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/student/notifications");
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications ?? []);
        setUnreadCount(json.unreadCount ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function markAllRead() {
    setMarking(true);
    try {
      const res = await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } finally {
      setMarking(false);
    }
  }

  async function markOneRead(id: string) {
    try {
      await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <StudentLayout headerTitle="Notifications">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout
      headerTitle="Notifications"
      headerSubtitle="Your activity and centre updates"
    >
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="font-semibold text-gray-800">
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            </span>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={marking}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Empty state */}
        {notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Activity updates from your centre will appear here.
            </p>
          </div>
        )}

        {/* Notification list */}
        <div className="space-y-2">
          {notifications.map((n) => {
            const icon = typeIcons[n.type] ?? typeIcons["GENERAL"];
            const bg = typeBg[n.type] ?? typeBg["GENERAL"];

            const CardContent = (
              <div
                className={`flex gap-4 p-4 rounded-xl border transition-all ${
                  n.isRead ? "bg-white border-gray-200" : `${bg}`
                }`}
              >
                {/* Icon */}
                <div
                  className={`shrink-0 mt-0.5 w-9 h-9 rounded-full flex items-center justify-center ${
                    n.isRead ? "bg-gray-100" : "bg-white shadow-sm"
                  }`}
                >
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-medium leading-tight ${
                        n.isRead ? "text-gray-700" : "text-gray-900"
                      }`}
                    >
                      {n.title}
                    </p>
                    <span className="text-xs text-gray-400 shrink-0">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {/* Unread dot / mark read */}
                <div className="shrink-0 mt-1">
                  {n.isRead ? (
                    <CheckCircle2 className="h-4 w-4 text-gray-300" />
                  ) : (
                    <button
                      title="Mark as read"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        markOneRead(n.id);
                      }}
                      className="group"
                    >
                      <Circle className="h-4 w-4 text-blue-500 group-hover:hidden" />
                      <CheckCircle2 className="h-4 w-4 text-blue-500 hidden group-hover:block" />
                    </button>
                  )}
                </div>
              </div>
            );

            return n.linkUrl ? (
              <a key={n.id} href={n.linkUrl} onClick={() => !n.isRead && markOneRead(n.id)}>
                {CardContent}
              </a>
            ) : (
              <div key={n.id}>{CardContent}</div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}
