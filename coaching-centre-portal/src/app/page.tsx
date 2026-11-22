"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldLogo } from "@/components/ShieldLogo";
import {
  Mic,
  BookOpen,
  Atom,
  PenTool,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  GraduationCap,
  Building,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const programs = [
    {
      icon: Mic,
      title: "Public Speaking & Debates",
      description:
        "Master the art of persuasion and eloquent expression. We guide students in structuring compelling arguments and engaging any audience with confidence.",
    },
    {
      icon: BookOpen,
      title: "Reading & Comprehension",
      description:
        "Develop advanced reading fluency and deep comprehension skills, enabling learners to analyze complex texts and extract key insights efficiently.",
    },
    {
      icon: Atom,
      title: "Scientific Literacy",
      description:
        "Build a strong foundation in scientific principles and critical thinking. Our curriculum fosters curiosity and analytical problem-solving.",
    },
    {
      icon: PenTool,
      title: "Creative & Technical Writing",
      description:
        "Learn to write with clarity, precision, and creativity. Covering everything from academic essays to compelling technical narratives.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description:
        "Complete registration in minutes to access attendance records, timetables, fee tracking, and study materials.",
    },
    {
      number: "02",
      title: "Connect with Your Centre",
      description:
        "Access your lecture streams, weekly schedule, teacher announcements, and real-time roll-call tracking.",
    },
    {
      number: "03",
      title: "StudyMate CBT Engine",
      description:
        "1-click launch into timed mock practice for JAMB UTME, WAEC, NECO, and Post-UTME with instant AI diagnostics.",
    },
  ];

  const faqs = [
    {
      q: "Who is this platform for?",
      a: "Our platform is built for coaching centres, tutorial colleges, and students preparing for JAMB UTME, WAEC, NECO, and Post-UTME across Nigeria.",
    },
    {
      q: "How does StudyMate CBT integration work?",
      a: "Students access the StudyMate learning engine with seamless 1-click Single Sign-On (SSO) directly from their student dashboard without requiring a second account or software subscription.",
    },
    {
      q: "Can coaching centre administrators manage fees and attendance?",
      a: "Yes. Centre directors and accountants have real-time fee tracking, automated receipts in Naira (₦), and daily roll-call attendance monitoring.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <ShieldLogo size="md" href="/" />

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 px-3.5 py-1.5 rounded-lg transition-colors shadow-2xs"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO SECTION (Clean Linear/Stripe Minimalist) ── */}
      <section className="bg-white border-b border-zinc-200 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Coaching Centre Management &amp; Student Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
            Academic Management, Streamlined.
          </h1>

          <p className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed">
            The central platform for Nigerian coaching centres and candidates. Timetable scheduling, fee tracking, daily attendance roll-call, and seamless StudyMate CBT access.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-semibold transition-colors shadow-2xs"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CORE CAPABILITIES ── */}
      <section className="py-16 bg-zinc-50/60 border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              Complete Educational SaaS Platform
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Designed specifically for tutorial colleges, remedial institutes, and examination prep centres.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog, idx) => {
              const Icon = prog.icon;
              return (
                <div
                  key={idx}
                  className="zinc-card p-6 space-y-2.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-950">{prog.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {prog.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Workflow
            </span>
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
              How the Platform Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, i) => (
              <div key={i} className="zinc-card p-5 space-y-2">
                <span className="font-mono text-xs font-bold text-zinc-400">{st.number}</span>
                <h3 className="text-sm font-semibold text-zinc-950">{st.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-zinc-50/60 border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-zinc-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-500">
              Everything you need to know about centre and student operations.
            </p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="zinc-card overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-zinc-900 hover:bg-zinc-50/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-500 border-t border-zinc-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white py-8 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldLogo size="sm" showText={false} />
            <span className="text-zinc-600 font-medium">Coaching Centre Portal SaaS</span>
          </div>
          <div>© {new Date().getFullYear()} All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
