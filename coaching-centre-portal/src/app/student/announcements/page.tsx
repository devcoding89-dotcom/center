"use client";

import React, { useState, useEffect } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import {
  Megaphone,
  Pin,
  Search,
  ChevronDown,
  AlertCircle,
  Calendar,
  Tag,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
  author?: { fullName: string } | null;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  GENERAL: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
  ACADEMIC: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-300" },
  FEES: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300" },
  EXAM: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-300" },
  SCHEDULE: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-300" },
  URGENT: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300" },
};

function categoryLabel(cat: string) {
  const map: Record<string, string> = {
    GENERAL: "General",
    ACADEMIC: "Academic",
    FEES: "Fees & Payments",
    EXAM: "Exam Notice",
    SCHEDULE: "Schedule Change",
    URGENT: "Urgent",
  };
  return map[cat] ?? cat;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/student/me");
        if (res.ok) {
          const json = await res.json();
          setAnnouncements(json.announcements ?? []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["ALL", ...Array.from(new Set(announcements.map((a) => a.category)))];

  const filtered = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const pinned = filtered.filter((a) => a.isPinned);
  const regular = filtered.filter((a) => !a.isPinned);

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return (
      <StudentLayout headerTitle="Announcements">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout
      headerTitle="Announcements"
      headerSubtitle="Stay updated with all notices from your coaching centre"
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All Categories" : categoryLabel(c)}
                </option>
              ))}
            </select>
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No announcements found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || categoryFilter !== "ALL"
                ? "Try adjusting your search or filter."
                : "Your centre hasn't posted any announcements yet."}
            </p>
          </div>
        )}

        {/* Pinned announcements */}
        {pinned.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Pin className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Pinned
              </h2>
            </div>
            <div className="space-y-3">
              {pinned.map((ann) => (
                <AnnouncementCard
                  key={ann.id}
                  ann={ann}
                  expanded={!!expanded[ann.id]}
                  onToggle={() => toggle(ann.id)}
                  pinned
                />
              ))}
            </div>
          </section>
        )}

        {/* Regular announcements */}
        {regular.length > 0 && (
          <section>
            {pinned.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Megaphone className="h-4 w-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  All Announcements
                </h2>
              </div>
            )}
            <div className="space-y-3">
              {regular.map((ann) => (
                <AnnouncementCard
                  key={ann.id}
                  ann={ann}
                  expanded={!!expanded[ann.id]}
                  onToggle={() => toggle(ann.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </StudentLayout>
  );
}

function AnnouncementCard({
  ann,
  expanded,
  onToggle,
  pinned = false,
}: {
  ann: Announcement;
  expanded: boolean;
  onToggle: () => void;
  pinned?: boolean;
}) {
  const colors = categoryColors[ann.category] ?? categoryColors["GENERAL"];
  const isLong = ann.content.length > 200;

  return (
    <div
      className={`bg-white rounded-xl border ${
        pinned ? "border-blue-200 shadow-sm" : "border-gray-200"
      } overflow-hidden`}
    >
      {/* Pinned ribbon */}
      {pinned && (
        <div className="bg-blue-600 px-4 py-1 flex items-center gap-2">
          <Pin className="h-3 w-3 text-white" />
          <span className="text-xs font-medium text-white">Pinned Notice</span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {categoryLabel(ann.category)}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />
                {formatDate(ann.createdAt)}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {ann.title}
            </h3>
            {ann.author && (
              <p className="text-xs text-gray-400 mt-0.5">
                Posted by {ann.author.fullName}
              </p>
            )}
          </div>
          {isLong && (
            <button
              onClick={onToggle}
              className="shrink-0 text-blue-600 hover:text-blue-700"
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        <div
          className={`mt-3 text-sm text-gray-700 leading-relaxed ${
            isLong && !expanded ? "line-clamp-3" : ""
          }`}
        >
          {ann.content}
        </div>

        {isLong && !expanded && (
          <button
            onClick={onToggle}
            className="mt-2 text-xs text-blue-600 hover:underline font-medium"
          >
            Read more
          </button>
        )}
      </div>
    </div>
  );
}
