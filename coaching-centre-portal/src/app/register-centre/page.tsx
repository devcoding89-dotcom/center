"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

export default function RegisterCentrePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    centreName: "",
    state: "Lagos State",
    city: "Yaba",
    address: "",
    phone: "",
    ownerFullName: "",
    ownerEmail: "",
    ownerPassword: "",
    ownerPhone: "",
    subscriptionTier: "STANDARD",
  });

  const nigerianStates = [
    "Lagos State",
    "Abuja FCT",
    "Oyo State",
    "Rivers State",
    "Ogun State",
    "Kano State",
    "Kaduna State",
    "Edo State",
    "Enugu State",
    "Delta State",
    "Anambra State",
    "Kwara State",
    "Ondo State",
    "Akwa Ibom State",
  ];

  const plans = [
    {
      id: "STARTER",
      name: "Starter Tier",
      fee: "₦5,000 / mo",
      limit: "Up to 50 Students",
      desc: "Single centre location with core attendance & fee tracking.",
    },
    {
      id: "STANDARD",
      name: "Standard Tier",
      fee: "₦10,000 / mo",
      limit: "Up to 150 Students",
      desc: "Includes multiple branches, tutor roles, and Tutorial College readiness.",
    },
    {
      id: "PREMIUM",
      name: "Premium Tier",
      fee: "₦20,000 / mo",
      limit: "Up to 500 Students",
      desc: "Full institute suite with advanced analytics and priority support.",
    },
  ];

  const handleRegister = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register-centre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create coaching centre");
        setLoading(false);
        return;
      }

      // Auto-redirect to Centre Owner Dashboard
      router.push("/dashboard");
    } catch {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-zinc-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Coaching Portal
          </span>
        </Link>
        <h2 className="mt-3 text-2xl font-bold text-white tracking-tight">
          Register Your Coaching Centre
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Get your private, multi-tenant academic operations dashboard in minutes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-zinc-900/90 border border-zinc-800 py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? "bg-emerald-500 text-zinc-950"
                      : step > s
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    step === s ? "text-white" : "text-zinc-500"
                  }`}
                >
                  {s === 1
                    ? "Centre Profile"
                    : s === 2
                    ? "Owner Account"
                    : "Subscription Plan"}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-950/50 border border-rose-900/60 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* STEP 1: Centre Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Coaching Centre Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Scholars Academy"
                  value={formData.centreName}
                  onChange={(e) =>
                    setFormData({ ...formData, centreName: e.target.value })
                  }
                  className="mt-1.5 block w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="mt-1.5 block w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {nigerianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yaba, Ikeja, Wuse"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="mt-1.5 block w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 Commercial Avenue, Opposite University Gate"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="mt-1.5 block w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Official Centre Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="08031234567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1.5 block w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  disabled={!formData.centreName.trim()}
                  onClick={() => setStep(2)}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <span>Continue to Owner Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Owner Credentials */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Director / Owner Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Babatunde Ogunlesi"
                  value={formData.ownerFullName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerFullName: e.target.value })
                  }
                  className="mt-1.5 block w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Owner Email Address (Your Login) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="owner@yourcentre.ng"
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                  className="mt-1.5 block w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.ownerPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPassword: e.target.value })
                  }
                  className="mt-1.5 block w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={
                    !formData.ownerFullName.trim() ||
                    !formData.ownerEmail.trim() ||
                    formData.ownerPassword.length < 6
                  }
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <span>Continue to Plan Selection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Plan Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() =>
                      setFormData({ ...formData, subscriptionTier: p.id })
                    }
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      formData.subscriptionTier === p.id
                        ? "bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950/30"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-white flex items-center gap-2">
                        <span>{p.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                          {p.limit}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{p.desc}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="text-xs font-bold text-emerald-400">
                        {p.fee}
                      </div>
                      <div className="text-[10px] text-zinc-500">30-day free trial</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All plans include free 30-day trial with full access.</span>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRegister}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-950 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Launch My Coaching Portal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-zinc-500">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
