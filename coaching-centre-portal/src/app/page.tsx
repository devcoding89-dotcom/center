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
  ExternalLink,
  Users,
  Award,
  Sparkles,
  BookMarked,
  Layers,
  GraduationCap,
  Building,
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
        "Build a strong foundation in scientific principles and critical thinking. Our curriculum fosters curiosity and the ability to analyze data.",
    },
    {
      icon: PenTool,
      title: "Creative & Technical Writing",
      description:
        "Learn to write with clarity, precision, and creativity. We cover everything from academic essays and research papers to compelling narratives.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Account",
      description:
        "Complete our simple registration form in just a few minutes. This gives you immediate access to our digital platform, where you can view course materials, track your progress, and manage your schedule.",
    },
    {
      number: "2",
      title: "Access Learning Materials",
      description:
        "Once registered, you can explore a rich library of lessons, video tutorials, practice exercises, and reading guides. All materials are designed by expert educators to be engaging and effective.",
    },
    {
      number: "3",
      title: "Join the Community",
      description:
        "Connect with fellow learners, mentors, and educators in our exclusive WhatsApp forum. It's a place to share insights, ask questions, and practice your skills in a supportive environment.",
    },
  ];

  const testimonials = [
    {
      name: "Jane D.",
      role: "University Student",
      quote:
        "The public speaking module was a game-changer for me. I went from being terrified of presentations to actually enjoying them. The instructors were incredibly supportive.",
    },
    {
      name: "Samuel B.",
      role: "Parent",
      quote:
        "I enrolled my son to help with his reading fluency, and the improvement has been remarkable. He's more confident and engaged in his schoolwork. Highly recommended.",
    },
    {
      name: "Fatima K.",
      role: "Marketing Manager",
      quote:
        "As a professional, clear communication is everything. The skills I learned here have directly contributed to my career advancement. The curriculum is practical and effective.",
    },
  ];

  const faqs = [
    {
      q: "Who is this program for?",
      a: "Our programs are designed for secondary school students, university candidates, young professionals, and lifelong learners seeking mastery in communication, critical reading, and scientific problem-solving. Whether preparing for high-stakes examinations (such as JAMB/WAEC) or professional speaking, our curriculum adapts to your goals.",
    },
    {
      q: "Are the classes online or in-person?",
      a: "We offer flexible hybrid learning options. Students can join live, interactive online classes from anywhere in the world, or attend physical study sessions, masterclasses, and CBT simulator labs at our designated coaching centres.",
    },
    {
      q: "What is the cost of registration?",
      a: "Registration is transparent and affordable. Each centre plan includes comprehensive access to lecture materials, study schedules, and seamless StudyMate CBT access without hidden charges or recurring student software fees.",
    },
    {
      q: "How do I join the WhatsApp community?",
      a: "Upon completing your platform registration or enrolment, you will receive an immediate automated invitation to your cohort's WhatsApp forum, where mentors, teachers, and peers collaborate daily.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ---------------- HEADER ---------------- */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <ShieldLogo size="md" href="/" />

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-700 px-3 py-1.5 transition-colors hidden md:inline-block"
            >
              Teacher Portal
            </Link>

            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-slate-800 hover:text-black px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              Log In
            </Link>

            <Link
              href="/register"
              className="text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors shadow-xs"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="bg-white border-b border-slate-200 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
            <span>Excellence in Speech, Study & Self-Expression</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
            Stoics Educational Institute &amp; Services
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We are dedicated to developing confident, articulate speakers, skilled readers, and critical thinkers. Our institute provides a supportive learning environment for students worldwide who want to improve their communication, reading fluency, scientific literacy, and writing skills.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="https://chat.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Join WhatsApp Forum</span>
            </a>

            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs"
            >
              <span>Register on Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Demo Logins Banner */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Quick Portal Access:</span>
            <Link
              href="/login"
              className="font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Centre Owner &amp; Accountant Portal</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/login"
              className="font-bold text-slate-800 hover:underline flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student Portal &amp; StudyMate</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- IMPROVE ESSENTIAL SKILLS ---------------- */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Improve Your Essential Skills
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We focus on practical, real-world skills that are essential for academic excellence, professional success, and personal development. Our programs are designed to build a strong foundation for lifelong learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((prog, idx) => {
              const Icon = prog.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-colors space-y-3"
                >
                  <div className="w-11 h-11 rounded bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{prog.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {prog.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- EDUCATIONAL PHILOSOPHY ---------------- */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Our Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Our Educational Philosophy
            </h2>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-7 sm:p-9 space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            <p>
              At the Stoics Educational Institute, we believe that true education transcends rote memorization. Our philosophy is rooted in the timeless principles of critical thinking, personal virtue, and articulate expression. We don't just teach skills; we cultivate habits of mind that empower our students to navigate a complex world with wisdom and resilience.
            </p>
            <p>
              Our curriculum is designed to be interactive and practical. We emphasize learning through doing, with a focus on real-world application. Whether it's through structured debates, presentation workshops, or collaborative reading sessions, our goal is to build a student's confidence from the inside out, so that clear communication becomes second nature.
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <span>Learn More &amp; Register</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Getting started on your journey to confident communication is simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 shadow-xs space-y-4 relative"
              >
                <div className="w-9 h-9 rounded bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center">
                  {st.number}
                </div>
                <h3 className="text-base font-bold text-slate-950">{st.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHAT OUR STUDENTS SAY ---------------- */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              What Our Students Say
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              We're proud to have helped learners from all over the world find their voice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-lg p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4"
              >
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="pt-2 border-t border-slate-200">
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{t.name}</div>
                  <div className="text-[11px] font-semibold text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FREQUENTLY ASKED QUESTIONS ---------------- */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Have questions? We have answers.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-700"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                      openFaq === i ? "rotate-180 text-blue-700" : ""
                    }`}
                  />
                </button>

                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA: JOIN A COMMUNITY OF EXCELLENCE ---------------- */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            Join a Community of Excellence
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Students are encouraged to invite their friends, while parents are urged to share this information widely. Together, we can nurture excellence in speech, study, and self-expression.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Stoics Institute */}
            <div className="space-y-3">
              <ShieldLogo size="sm" href="/" showText={true} />
              <p className="text-xs text-slate-400 leading-relaxed pt-2">
                Dedicated to developing articulate speakers, skilled readers, and critical thinkers through rigorous, student-centred coaching.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Registration
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Teacher Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Programs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Programs
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Public Speaking</li>
                <li>Debate Club</li>
                <li>Reading Fluency</li>
                <li>Scientific Literacy</li>
                <li>Academic Writing</li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Contact Us
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stoics Educational Institute &amp; Services
                <br />
                Enquiries &amp; Admissions
                <br />
                support@stoicsinstitute.org
              </p>
              <div className="pt-1">
                <a
                  href="https://chat.whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Join Community Forum</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Quote & Copyright */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p className="italic text-slate-400 font-medium text-center sm:text-left">
              “We don't just teach, we train voices, shape confidence, and inspire greatness.”
            </p>
            <p className="text-center sm:text-right">
              &copy; {new Date().getFullYear()} Stoics Educational Institute &amp; Services. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
