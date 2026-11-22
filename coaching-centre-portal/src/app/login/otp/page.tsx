"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldLogo } from "@/components/ShieldLogo";
import { CheckCircle2, ArrowRight, AlertCircle, KeyRound } from "lucide-react";

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(45);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const nextOtp = [...otp];
    nextOtp[index] = val;
    setOtp(nextOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    // Verify OTP or proceed with authenticated session
    setTimeout(() => {
      // Default fallback student or owner
      if (email.includes("owner")) {
        router.push("/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <ShieldLogo size="lg" href="/" showText={false} />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Enter Verification Code
        </h1>
        <p className="text-xs text-slate-600">
          We sent a 6-digit security code to{" "}
          <strong className="text-slate-900">{email || "your email"}</strong>
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

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 text-center mb-3">
                Security Code (OTP)
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded shadow-xs text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 space-y-2 text-xs">
            <div>
              {resendCooldown > 0 ? (
                <span className="text-slate-500">
                  Resend code in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setResendCooldown(45)}
                  className="font-bold text-blue-700 hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>

            <div>
              <Link
                href="/login"
                className="text-slate-500 hover:text-slate-800 underline font-medium"
              >
                ← Back to password login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
          Loading OTP verification...
        </div>
      }
    >
      <OtpContent />
    </Suspense>
  );
}
