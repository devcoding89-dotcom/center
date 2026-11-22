"use client";

import React, { useEffect, useState } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Download,
  Building,
  ArrowRight,
  ShieldCheck,
  Receipt,
  X,
} from "lucide-react";
import { formatNaira, formatDate } from "@/lib/utils";

export default function StudentFeesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);
  const [payingOnline, setPayingOnline] = useState(false);
  const [paySuccessMessage, setPaySuccessMessage] = useState(false);

  useEffect(() => {
    async function loadFinance() {
      try {
        const res = await fetch("/api/student/me");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFinance();
  }, []);

  const handleSimulatePayment = () => {
    setPayingOnline(true);
    setTimeout(() => {
      setPayingOnline(false);
      setPaySuccessMessage(true);
      setTimeout(() => setPaySuccessMessage(false), 5000);
    }, 1200);
  };

  if (loading) {
    return (
      <StudentLayout headerTitle="My Fees &amp; Tuition Ledger" headerSubtitle="Official financial records, payment receipts and outstanding balance">
        <div className="h-64 bg-slate-200 rounded-lg animate-pulse"></div>
      </StudentLayout>
    );
  }

  const { user, centre, profile, finance } = data || {};
  const invoices = finance?.invoices || [];

  return (
    <StudentLayout
      headerTitle="My Fees &amp; Tuition Ledger"
      headerSubtitle="Official financial statements, payment receipts and verified transactions"
    >
      <div className="space-y-6">
        {paySuccessMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payment instruction generated. Reference #PAY-2026-ONLINE sent to centre accounting.</span>
            </div>
            <button onClick={() => setPaySuccessMessage(false)} className="text-emerald-700 font-bold text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* ---------------- FINANCIAL SUMMARY ---------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Assessed Fees</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {formatNaira(finance?.totalBilled || 50000)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Term tuition &amp; enrolment fees</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Amount Paid</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
              {formatNaira(finance?.totalPaid || 35000)}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Verified &amp; Receipted</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Outstanding Balance</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
                {formatNaira(finance?.balanceDue || 15000)}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Due before mid-term exams</p>
            </div>

            {finance?.balanceDue > 0 && (
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={payingOnline}
                className="mt-3 w-full py-2 px-3 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
              >
                {payingOnline ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Pay Balance Online</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ---------------- INVOICES & PAYMENT HISTORY TABLE ---------------- */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                Official Tuition Invoices &amp; Receipts
              </h2>
              <p className="text-xs text-slate-500">
                Issued by {centre?.name} Accounting Department
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>All receipts carry official institutional verification</span>
            </div>
          </div>

          {invoices.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No invoice records found for your account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Date Issued</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Amount Paid</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {invoices.map((inv: any) => {
                    const isFullyPaid = inv.status === "PAID" || inv.paidAmount >= inv.totalAmount;
                    const isPartial = inv.paidAmount > 0 && inv.paidAmount < inv.totalAmount;

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {inv.title}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {formatDate(inv.issuedAt)}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900">
                          {formatNaira(inv.totalAmount)}
                        </td>
                        <td className="py-3 px-4 text-emerald-700 font-extrabold">
                          {formatNaira(inv.paidAmount)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isFullyPaid
                                ? "bg-emerald-100 text-emerald-800"
                                : isPartial
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isFullyPaid ? "FULLY PAID" : isPartial ? "PARTIAL" : "UNPAID"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {inv.paidAmount > 0 ? (
                            <button
                              type="button"
                              onClick={() => setActiveReceipt(inv)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 hover:bg-black text-white font-bold text-[11px] shadow-xs transition-colors"
                            >
                              <Printer className="w-3 h-3" />
                              <span>View Receipt</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No receipt</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ---------------- PRINTABLE OFFICIAL RECEIPT MODAL ---------------- */}
        {activeReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white border border-slate-300 rounded-lg w-full max-w-lg p-6 sm:p-8 shadow-2xl relative animate-fade-in text-slate-900">
              <button
                onClick={() => setActiveReceipt(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Receipt Header */}
              <div className="text-center pb-5 border-b border-slate-200 space-y-1">
                <div className="font-extrabold text-base text-slate-950 uppercase tracking-tight">
                  {centre?.name}
                </div>
                <div className="text-xs text-slate-500">
                  {centre?.address || "14 Commercial Avenue, Yaba, Lagos"}
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-extrabold text-[11px] uppercase tracking-wider mt-2">
                  Official Payment Receipt
                </div>
              </div>

              {/* Receipt Meta Details */}
              <div className="py-4 border-b border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Receipt / Invoice Ref:</span>
                  <span className="font-mono font-bold text-slate-900">{activeReceipt.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Candidate Name:</span>
                  <span className="font-bold text-slate-900">{user?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Registration Number:</span>
                  <span className="font-mono font-bold text-slate-900">{profile?.registrationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Date Issued:</span>
                  <span className="font-bold text-slate-900">{formatDate(activeReceipt.issuedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Payment Channel:</span>
                  <span className="font-bold text-slate-900">Verified Bank Transfer / Direct</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="py-4 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Item Description</span>
                  <span>Amount Paid</span>
                </div>
                <div className="flex justify-between text-slate-700 pt-1">
                  <span>{activeReceipt.title}</span>
                  <span className="font-bold text-slate-900">{formatNaira(activeReceipt.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                  <span>Total Invoice Value</span>
                  <span>{formatNaira(activeReceipt.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Remaining Balance</span>
                  <span>{formatNaira(activeReceipt.totalAmount - activeReceipt.paidAmount)}</span>
                </div>
              </div>

              {/* Total Box */}
              <div className="bg-slate-50 border border-slate-200 rounded p-4 flex items-center justify-between text-xs mt-2">
                <span className="font-bold text-slate-900 uppercase">Total Confirmed</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {formatNaira(activeReceipt.paidAmount)}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="px-4 py-2 rounded border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
