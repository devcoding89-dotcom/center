"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldLogo } from "@/components/ShieldLogo";
import {
  CheckCircle2,
  ArrowRight,
  AlertCircle,
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="flex justify-center">
          <ShieldLogo size="lg" href="/" showText={false} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-950">
          Create an Account
        </h1>
        <p className="text-xs text-zinc-500">
          Join your coaching centre portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-zinc-200 rounded-xl shadow-xs sm:px-8 space-y-5">
          {error && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-zinc-700" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-zinc-900 mx-auto" />
              <div className="text-sm font-bold text-zinc-950">Account Created!</div>
              <p className="text-xs text-zinc-500">
                Redirecting to sign in...
              </p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRole("STUDENT")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                      role === "STUDENT"
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("TEACHER")}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                      role === "TEACHER"
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    Teacher
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-2xs"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-3 border-t border-zinc-100">
            <span className="text-xs text-zinc-500">
              Already registered?{" "}
            </span>
            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-950 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
