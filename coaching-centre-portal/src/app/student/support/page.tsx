"use client";

import React, { useState, useEffect } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  adminReply?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CentreContact {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; badge: string }
> = {
  SUBMITTED: {
    label: "Submitted",
    icon: <Clock className="h-3 w-3" />,
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: <AlertCircle className="h-3 w-3" />,
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  RESOLVED: {
    label: "Resolved",
    icon: <CheckCircle2 className="h-3 w-3" />,
    badge: "bg-green-50 text-green-700 border border-green-200",
  },
};

const categories = [
  { value: "ACADEMIC", label: "Academic / Classes" },
  { value: "FEES", label: "Fees & Payments" },
  { value: "TIMETABLE", label: "Timetable" },
  { value: "TECHNICAL", label: "Technical / Platform" },
  { value: "OTHER", label: "Other" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [centre, setCentre] = useState<CentreContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const [form, setForm] = useState({
    subject: "",
    category: "ACADEMIC",
    message: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [meRes, ticketsRes] = await Promise.all([
          fetch("/api/student/me"),
          fetch("/api/student/support"),
        ]);
        if (meRes.ok) {
          const meJson = await meRes.json();
          if (meJson.centre) {
            setCentre({
              name: meJson.centre.name,
              phone: meJson.centre.phone,
              email: meJson.centre.email,
              address: meJson.centre.address,
            });
          }
        }
        if (ticketsRes.ok) {
          const ticketsJson = await ticketsRes.json();
          setTickets(ticketsJson.tickets ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.subject.trim() || !form.message.trim()) {
      setError("Please fill in both subject and message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/student/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitted(true);
        setForm({ subject: "", category: "ACADEMIC", message: "" });
        // Reload tickets
        const ticketsRes = await fetch("/api/student/support");
        if (ticketsRes.ok) {
          const ticketsJson = await ticketsRes.json();
          setTickets(ticketsJson.tickets ?? []);
        }
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(json.error ?? "Failed to submit ticket. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <StudentLayout headerTitle="Help & Support">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout
      headerTitle="Help & Support"
      headerSubtitle="Contact your centre or submit a support request"
    >
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT: Centre contact + ticket form */}
          <div className="lg:col-span-3 space-y-5">

            {/* Contact card */}
            {centre && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-800">Centre Contact</h2>
                </div>
                <p className="text-sm text-gray-600 font-medium">{centre.name}</p>

                <div className="space-y-2.5">
                  {centre.phone && (
                    <a
                      href={`tel:${centre.phone}`}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100">
                        <Phone className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>{centre.phone}</span>
                    </a>
                  )}
                  {centre.email && (
                    <a
                      href={`mailto:${centre.email}`}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>{centre.email}</span>
                    </a>
                  )}
                  {centre.address && (
                    <div className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="leading-relaxed">{centre.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ticket form */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">Submit a Request</h2>
              </div>

              {submitted && (
                <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Your request has been submitted. We'll get back to you soon.
                </div>
              )}

              {error && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={5}
                    placeholder="Describe your issue or question in detail…"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Ticket history */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-gray-600" />
                <h2 className="font-semibold text-gray-800">Your Requests</h2>
                {tickets.length > 0 && (
                  <span className="ml-auto text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                    {tickets.length}
                  </span>
                )}
              </div>

              {tickets.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No requests yet</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
                  {tickets.map((ticket) => {
                    const cfg = statusConfig[ticket.status] ?? statusConfig["SUBMITTED"];
                    const isExpanded = expandedTicket === ticket.id;

                    return (
                      <div
                        key={ticket.id}
                        className="border border-gray-100 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedTicket(isExpanded ? null : ticket.id)
                          }
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start justify-between gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {ticket.subject}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {formatDate(ticket.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}
                            >
                              {cfg.icon}
                              {cfg.label}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 text-gray-400 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-2 bg-gray-50 border-t border-gray-100">
                            <div className="pt-3">
                              <p className="text-xs text-gray-500 font-medium mb-1">
                                Your message:
                              </p>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {ticket.message}
                              </p>
                            </div>
                            {ticket.adminReply && (
                              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-2">
                                <p className="text-xs text-blue-600 font-medium mb-1">
                                  Centre reply:
                                </p>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                  {ticket.adminReply}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
