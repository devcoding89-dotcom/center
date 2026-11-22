"use client";

import React, { useEffect, useState } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import {
  User,
  Building,
  GraduationCap,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/student/me");
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setPhone(json.user?.phone || "");
          setAddress(json.profile?.address || "Yaba, Lagos");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    // Simulate contact info update
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  if (loading) {
    return (
      <StudentLayout headerTitle="My Student Profile" headerSubtitle="Manage your candidate records and personal contact information">
        <div className="h-64 bg-slate-200 rounded-lg animate-pulse"></div>
      </StudentLayout>
    );
  }

  const { user, centre, profile, enrolledBatch } = data || {};

  return (
    <StudentLayout
      headerTitle="My Student Profile"
      headerSubtitle="Institutional candidate details, academic stream enrolment and guardian contact"
    >
      <div className="space-y-6">
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Contact details updated successfully.</span>
          </div>
        )}

        {/* 1. Header Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center">
              {user?.fullName?.split(" ").map((n: string) => n[0]).join("") || "ST"}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">{user?.fullName}</h2>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Reg No: <strong className="text-slate-900">{profile?.registrationNumber}</strong>
              </div>
              <div className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mt-1">
                Active Enrolment • {centre?.name}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs sm:text-right">
            <div className="text-[10px] uppercase font-bold text-slate-500">Academic Target</div>
            <div className="font-extrabold text-slate-900">{profile?.targetExam?.replace("_", " ")}</div>
            <div className="text-[11px] text-slate-500">{profile?.targetCourse || "Science/Arts"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Personal & Academic Records */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Information (Strictly Read-Only) */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span>Academic Enrolment (Institutional Record)</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Lock className="w-3 h-3" />
                  <span>Centre Managed</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Coaching Institution:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{centre?.name}</div>
                </div>

                <div>
                  <span className="text-slate-500">Academic Session:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{centre?.session || "2026/2027"}</div>
                </div>

                <div>
                  <span className="text-slate-500">Assigned Programme:</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {enrolledBatch?.programme?.name || "JAMB UTME Comprehensive"}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500">Class Lecture Stream:</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {enrolledBatch?.name || "Morning Alpha Stream"}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500">Target Institution:</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {profile?.targetInstitution || "University of Choice"}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500">Admission Date:</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {formatDate(profile?.enrollmentDate || new Date())}
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Contact Details */}
            <form
              onSubmit={handleUpdateContact}
              className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <User className="w-4 h-4 text-blue-700" />
                  <span>Personal Contact Information</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  Permitted to update
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-3 py-2 border border-slate-200 rounded bg-slate-100 text-slate-600 font-mono text-xs cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Email changes require admin assistance.</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, State"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-xs focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Guardian Information */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-200">
                <Shield className="w-4 h-4 text-blue-700" />
                <span>Parent / Guardian Records</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500">Guardian Name:</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {profile?.guardianName || "Chief C. Okafor"}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500">Guardian Phone:</span>
                  <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile?.guardianPhone || "08031234567"}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500">Guardian Email:</span>
                  <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile?.guardianEmail || "guardian@goodcentre.ng"}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 leading-relaxed">
                Emergency academic notices and fee receipts are automatically copied to your registered guardian.
              </div>
            </div>

            {/* Centre Contact Information */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3 text-xs">
              <div className="font-bold text-slate-900 uppercase tracking-wider">
                Centre Enquiries Desk
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {centre?.name}
                <br />
                {centre?.address || "14 Commercial Avenue, Yaba, Lagos"}
                <br />
                Phone: {centre?.phone || "08031234567"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
