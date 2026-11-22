"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldLogo } from "@/components/ShieldLogo";
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  GraduationCap,
  AlertCircle,
  Building,
  KeyRound,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 1-Click Instant Demo Login (skips form and signs in immediately)
  const handleDemoLogin = async (demoEmail: string, demoPass: string, roleName: string) => {
    setError(null);
    setDemoLoading(roleName);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Demo login failed");
        setDemoLoading(null);
        return;
      }

      if (data.user?.activeRole === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during demo sign in");
      setDemoLoading(null);
    }
  };

  // Pre-fill demo data for creating a new account
  const handleFillDemo = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setFirstName("Emeka");
    setLastName(`Balogun_${randomId}`);
    setEmail(`emeka_${randomId}@student.ng`);
    setPassword("Student2026!");
    setRole("STUDENT");
    setLanguage("English");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register-centre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please check your details.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <ShieldLogo size="lg" href="/" showText={false} />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Create Your Account
        </h1>
        <p className="text-xs text-slate-600">
          Join Stoics Educational Institute &amp; Services
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xs border border-slate-200 rounded-lg sm:px-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
              <span>Account created successfully! Redirecting to sign in...</span>
            </div>
          )}

          {/* ---------------- 1-CLICK INSTANT DEMO SIGN IN ---------------- */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span>1-Click Demo Sign In</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                Instant Access
              </span>
            </div>
            <p className="text-[11px] text-blue-800 leading-snug">
              Skip typing and sign in directly with pre-configured demo credentials:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Demo Centre Owner & Accountant */}
              <button
                type="button"
                disabled={Boolean(demoLoading)}
                onClick={() =>
                  handleDemoLogin("owner@goodcentre.ng", "GoodCentre2026!", "owner")
                }
                className="p-3 rounded border border-slate-300 bg-white hover:bg-slate-50 text-left transition-colors shadow-xs disabled:opacity-50"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Building className="w-3.5 h-3.5 text-blue-700" />
                  <span>{demoLoading === "owner" ? "Signing In..." : "Centre Admin"}</span>
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5 font-medium">
                  Includes Accountant
                </div>
              </button>

              {/* Demo Student Portal */}
              <button
                type="button"
                disabled={Boolean(demoLoading)}
                onClick={() =>
                  handleDemoLogin("chinedu@student.ng", "Student2026!", "student")
                }
                className="p-3 rounded border border-slate-300 bg-white hover:bg-slate-50 text-left transition-colors shadow-xs disabled:opacity-50"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-900" />
                  <span>{demoLoading === "student" ? "Signing In..." : "Student Portal"}</span>
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5 font-medium">
                  + StudyMate CBT SSO
                </div>
              </button>
            </div>
          </div>

          {/* Social Sign Up / Google Demo */}
          <div>
            <button
              type="button"
              onClick={() =>
                handleDemoLogin("chinedu@student.ng", "Student2026!", "student")
              }
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-slate-300 rounded text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google (Demo Sign In)</span>
            </button>

            <div className="mt-5 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-500 font-medium">
                  Or register a new account
                </span>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Registration Fields
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>Pre-fill Form Data</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Emeka"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Balogun"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="emeka@student.ng"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                minLength={8}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700"
              />
            </div>

            {/* "I am a..." selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("STUDENT")}
                  className={`py-2 px-3 rounded border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    role === "STUDENT"
                      ? "border-blue-700 bg-blue-50 text-blue-900"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("TEACHER")}
                  className={`py-2 px-3 rounded border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    role === "TEACHER"
                      ? "border-blue-700 bg-blue-50 text-blue-900"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Teacher</span>
                </button>
              </div>
              {role === "TEACHER" && (
                <p className="text-[11px] text-amber-700 mt-1">
                  * Note: Teacher/Staff registration requires administrator approval.
                </p>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-bold text-slate-800">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-700"
              >
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
                <option>Italiano</option>
                <option>Português</option>
                <option>日本語</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded shadow-xs text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-600">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
