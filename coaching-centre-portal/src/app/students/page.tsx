"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    targetExam: "JAMB_UTME",
    targetCourse: "Medicine & Surgery",
    guardianName: "",
    guardianPhone: "",
    classBatchId: "",
    initialTuition: 45000,
  });

  const fetchData = async () => {
    try {
      const [resS, resB] = await Promise.all([
        fetch("/api/centre/students"),
        fetch("/api/centre/batches"),
      ]);
      if (resS.ok) {
        const jsonS = await resS.json();
        setStudents(jsonS.students || []);
      }
      if (resB.ok) {
        const jsonB = await resB.json();
        setBatches(jsonB.batches || []);
        if (jsonB.batches?.length > 0 && !formData.classBatchId) {
          setFormData((prev) => ({ ...prev, classBatchId: jsonB.batches[0].id }));
        }
      }
    } catch (e) {
      console.error("Fetch students error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/centre/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to enroll student");
        setSaving(false);
        return;
      }

      setShowAddModal(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        targetExam: "JAMB_UTME",
        targetCourse: "Medicine & Surgery",
        guardianName: "",
        guardianPhone: "",
        classBatchId: batches[0]?.id || "",
        initialTuition: 45000,
      });
      await fetchData();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetExam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      headerTitle="Student Management"
      headerSubtitle="Manage enrolled candidates, target examinations, and class batch assignments"
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, reg number, exam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll New Student</span>
          </button>
        </div>

        {/* Students Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Reg Number</th>
                  <th className="py-3 px-4">Exam & Target Course</th>
                  <th className="py-3 px-4">Class Batch</th>
                  <th className="py-3 px-4">Guardian Contact</th>
                  <th className="py-3 px-4">Tuition Status</th>
                  <th className="py-3 px-4">Enrolled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {s.user?.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{s.user?.email}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {s.registrationNumber}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {s.targetExam?.replace("_", " ")}
                      </span>
                      {s.targetCourse && (
                        <div className="text-[11px] text-slate-500 mt-1">
                          {s.targetCourse}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {s.enrollments?.[0]?.classBatch?.name || (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">
                        {s.guardianName || "-"}
                      </div>
                      {s.guardianPhone && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{s.guardianPhone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {s.invoices?.[0] ? (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            s.invoices[0].status === "PAID"
                              ? "bg-slate-900 text-white border-slate-900"
                              : s.invoices[0].status === "PARTIALLY_PAID"
                              ? "bg-blue-50 text-blue-900 border-blue-200"
                              : "bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          {s.invoices[0].status.replace("_", " ")}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">No Invoice</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(s.enrollmentDate)}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Enroll Student */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-lg w-full max-w-lg p-6 shadow-xl relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-slate-900">
                Enroll New Student
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Register candidate and assign to a programme batch
              </p>

              {error && (
                <div className="mb-4 p-2.5 rounded bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina Bello"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="amina@student.ng"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Student Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="08012345678"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Target Exam *
                    </label>
                    <select
                      value={formData.targetExam}
                      onChange={(e) =>
                        setFormData({ ...formData, targetExam: e.target.value })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    >
                      <option value="JAMB_UTME">JAMB UTME</option>
                      <option value="WAEC_SSCE">WAEC SSCE</option>
                      <option value="NECO_SSCE">NECO SSCE</option>
                      <option value="POST_UTME">Post-UTME</option>
                      <option value="GCE">GCE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Class Batch Assignment
                    </label>
                    <select
                      value={formData.classBatchId}
                      onChange={(e) =>
                        setFormData({ ...formData, classBatchId: e.target.value })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    >
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.capacity} cap)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Tuition Fee (₦)
                    </label>
                    <input
                      type="number"
                      value={formData.initialTuition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          initialTuition: Number(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Guardian Name
                    </label>
                    <input
                      type="text"
                      placeholder="Alhaji Bello"
                      value={formData.guardianName}
                      onChange={(e) =>
                        setFormData({ ...formData, guardianName: e.target.value })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Guardian Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="08033221100"
                      value={formData.guardianPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, guardianPhone: e.target.value })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                  >
                    {saving ? "Saving..." : "Complete Enrollment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
