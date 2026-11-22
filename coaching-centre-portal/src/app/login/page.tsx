"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldLogo } from "@/components/ShieldLogo";
import {
  Building,
  ArrowRight,
  Shield,
  ShieldCheck,
  GraduationCap,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customCreds?: { email: string; pass: string }) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = customCreds ? customCreds.email : email;
    const loginPass = customCreds ? customCreds.pass : password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Role-based destination: Student vs Centre Admin / Owner
      if (data.user.activeRole === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
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
          Welcome Back
        </h1>
        <p className="text-xs text-slate-600">
          Sign in with Google or your email.
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

          {/* Social Sign In */}
          <div>
            <button
              type="button"
              onClick={() => {
                // Pre-fill demo student
                handleLogin(undefined, { email: "chinedu@student.ng", pass: "Student2026!" });
              }}
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
              <span>Continue with Google</span>
            </button>

            <div className="mt-5 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-500 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-800">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Password
                </label>
                <Link
                  href={`/login/otp?email=${encodeURIComponent(email)}`}
                  className="text-[11px] font-semibold text-blue-700 hover:underline"
                >
                  Sign in with email OTP instead
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700"
              />
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
                    <span>Continue with Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
              1-Click Demo Accounts
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  handleLogin(undefined, {
                    email: "owner@goodcentre.ng",
                    pass: "GoodCentre2026!",
                  })
                }
                className="p-3 rounded border border-slate-300 bg-white hover:bg-slate-50 text-left transition-colors shadow-xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Building className="w-3.5 h-3.5 text-blue-700" />
                  <span>Centre Admin</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  Includes Accountant
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleLogin(undefined, {
                    email: "chinedu@student.ng",
                    pass: "Student2026!",
                  })
                }
                className="p-3 rounded border border-slate-300 bg-white hover:bg-slate-50 text-left transition-colors shadow-xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-900" />
                  <span>Student Portal</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  + StudyMate CBT SSO
                </div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-600">
              Don't have an account?{" "}
            </span>
            <Link
              href="/register"
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
