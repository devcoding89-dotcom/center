"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Mail, Phone, Plus, Shield } from "lucide-react";

export default function StaffPage() {
  const staff = [
    {
      name: "Dr. Babatunde Ogunlesi",
      role: "Centre Owner & Lead Director",
      email: "owner@goodcentre.ng",
      phone: "08033445566",
      code: "DIR/001",
    },
    {
      name: "Mrs. Funke Akindele",
      role: "Centre Manager",
      email: "manager@goodcentre.ng",
      phone: "08055667788",
      code: "MGR/001",
    },
    {
      name: "Mr. Emeka Obi",
      role: "Finance & Accounts Officer",
      email: "accountant@goodcentre.ng",
      phone: "08077889900",
      code: "ACC/001",
    },
    {
      name: "Mr. Samuel Okon",
      role: "Senior Physics & Mathematics Tutor",
      email: "teacher@goodcentre.ng",
      phone: "08099001122",
      code: "STF/GCC/001",
    },
  ];

  return (
    <DashboardLayout
      headerTitle="Teachers & Staff Directory"
      headerSubtitle="Manage administrative personnel, subject teachers, and institutional roles"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Institutional Team
            </h2>
            <p className="text-xs text-slate-500">
              {staff.length} staff members with verified roles
            </p>
          </div>
          <button className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Staff Member</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staff.map((m) => (
            <div
              key={m.email}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {m.name}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {m.code}
                  </span>
                </div>
                <div className="text-xs text-blue-700 font-semibold mt-1">
                  {m.role}
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.phone}</span>
                  </div>
                </div>
              </div>
              <Shield className="w-5 h-5 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
