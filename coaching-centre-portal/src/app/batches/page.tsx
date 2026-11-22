"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Clock, MapPin, X } from "lucide-react";

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    programmeId: "",
    schedule: "Mon - Thu: 8:30 AM - 1:30 PM",
    capacity: 45,
    roomNumber: "Hall A1",
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/centre/batches");
      if (res.ok) {
        const json = await res.json();
        setBatches(json.batches || []);
        setProgrammes(json.programmes || []);
        if (json.programmes?.length > 0 && !formData.programmeId) {
          setFormData((p) => ({ ...p, programmeId: json.programmes[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/centre/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          name: "",
          programmeId: programmes[0]?.id || "",
          schedule: "Mon - Thu: 8:30 AM - 1:30 PM",
          capacity: 45,
          roomNumber: "Hall A1",
        });
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      headerTitle="Classes & Batches"
      headerSubtitle="Organize academic lecture streams, morning/evening shifts, and hall capacities"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Academic Streams
            </h2>
            <p className="text-xs text-slate-500">
              {batches.length} active class batches configured
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Class Batch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {batches.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {b.programme?.examCategory?.replace("_", " ")}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {b._count?.enrollments || 0} / {b.capacity} Students
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3">
                  {b.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{b.programme?.name}</p>

                <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.schedule || "Regular schedule"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.roomNumber || "Main Hall"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-emerald-700 font-semibold">Active</span>
                <span>Branch: {b.branch?.name || "Main Campus"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Create Batch */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-slate-900">
                Create Class Batch
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Set up a new lecture stream or weekend intensive group
              </p>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JAMB Afternoon Express"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Programme *
                  </label>
                  <select
                    value={formData.programmeId}
                    onChange={(e) =>
                      setFormData({ ...formData, programmeId: e.target.value })
                    }
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  >
                    {programmes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.examCategory})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Hall / Room
                    </label>
                    <input
                      type="text"
                      placeholder="Room B4"
                      value={formData.roomNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, roomNumber: e.target.value })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: Number(e.target.value) })
                      }
                      className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Weekly Schedule
                  </label>
                  <input
                    type="text"
                    placeholder="Mon - Fri: 8:30 AM - 1:30 PM"
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule: e.target.value })
                    }
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                  >
                    {saving ? "Saving..." : "Create Batch"}
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
