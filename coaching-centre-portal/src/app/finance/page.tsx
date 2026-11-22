"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  CreditCard,
  Plus,
  Receipt,
  Search,
  Filter,
  X,
  Printer,
  CheckCircle2,
  Building,
} from "lucide-react";
import { formatNaira, formatDate } from "@/lib/utils";

export default function FinancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<any>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forms state
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: "",
    title: "Full Term Tuition - JAMB/WAEC 2026",
    amount: 45000,
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentAmount: 15000,
    paymentMethod: "BANK_TRANSFER",
    reference: "",
    notes: "",
  });

  const fetchFinanceData = async () => {
    try {
      const res = await fetch("/api/centre/finance");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.students?.length > 0 && !invoiceForm.studentId) {
          setInvoiceForm((p) => ({ ...p, studentId: json.students[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/centre/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_INVOICE",
          studentId: invoiceForm.studentId,
          title: invoiceForm.title,
          amount: invoiceForm.amount,
        }),
      });
      if (res.ok) {
        setShowInvoiceModal(false);
        setInvoiceForm({
          studentId: data?.students?.[0]?.id || "",
          title: "Full Term Tuition - JAMB/WAEC 2026",
          amount: 45000,
        });
        await fetchFinanceData();
      } else {
        const j = await res.json();
        setError(j.error || "Failed to create invoice");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPay) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/centre/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RECORD_PAYMENT",
          invoiceId: selectedInvoiceForPay.id,
          paymentAmount: paymentForm.paymentAmount,
          paymentMethod: paymentForm.paymentMethod,
          reference: paymentForm.reference,
          notes: paymentForm.notes,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setShowPaymentModal(false);
        // Immediately show the generated receipt
        setSelectedReceipt({
          receiptNumber: json.payment.receiptNumber,
          studentName: selectedInvoiceForPay.student?.user?.fullName,
          regNo: selectedInvoiceForPay.student?.registrationNumber,
          title: selectedInvoiceForPay.title,
          amountPaid: json.payment.amount,
          totalInvoice: selectedInvoiceForPay.totalAmount,
          newPaidTotal: selectedInvoiceForPay.paidAmount + json.payment.amount,
          method: json.payment.paymentMethod,
          reference: json.payment.reference,
          date: new Date(),
        });
        await fetchFinanceData();
      } else {
        const j = await res.json();
        setError(j.error || "Failed to record payment");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const { metrics, invoices = [], students = [] } = data || {};

  const filteredInvoices = invoices.filter((inv: any) => {
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.student?.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.student?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout
      headerTitle="Centre Accounting & Fees"
      headerSubtitle="Proprietor finance controls: Invoicing, payment allocations, receipts, and balances in Naira (₦)"
    >
      <div className="space-y-6">
        {/* Accounting Summary Cards (Blue, Black, Gray) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Invoiced (Billed)
            </span>
            <div className="text-2xl font-extrabold text-black mt-2">
              {formatNaira(metrics?.totalInvoiced || 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {metrics?.invoicesCount || 0} student invoices generated
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Collected Tuition Revenue
            </span>
            <div className="text-2xl font-extrabold text-blue-600 mt-2">
              {formatNaira(metrics?.totalPaid || 0)}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">
              {metrics?.collectionRate || 0}% collection efficiency
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Outstanding Balances Due
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {formatNaira(metrics?.outstandingBalance || 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Pending student tuition balances
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                statusFilter === "ALL"
                  ? "bg-black text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Invoices
            </button>
            <button
              onClick={() => setStatusFilter("PAID")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                statusFilter === "PAID"
                  ? "bg-black text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Fully Settled
            </button>
            <button
              onClick={() => setStatusFilter("PARTIALLY_PAID")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                statusFilter === "PARTIALLY_PAID"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Partially Paid
            </button>
            <button
              onClick={() => setStatusFilter("UNPAID")}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                statusFilter === "UNPAID"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Unpaid
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoice or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-black placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Invoice</span>
            </button>
          </div>
        </div>

        {/* Financial Ledger Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-black">
              Student Tuition Ledger & Invoices
            </h3>
            <span className="text-xs text-slate-500">
              Showing {filteredInvoices.length} invoices
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Student & Reg No</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Paid to Date</th>
                  <th className="py-3 px-4">Balance Remaining</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Accounting Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv: any) => {
                  const balance = inv.totalAmount - inv.paidAmount;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-black">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-black">{inv.student?.user?.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {inv.student?.registrationNumber}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {inv.title}
                      </td>

                      <td className="py-3 px-4 font-bold text-black">
                        {formatNaira(inv.totalAmount)}
                      </td>

                      <td className="py-3 px-4 font-bold text-blue-600">
                        {formatNaira(inv.paidAmount)}
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-800">
                        {balance > 0 ? formatNaira(balance) : "₦0 (Cleared)"}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.status === "PAID"
                              ? "bg-slate-100 text-black border border-slate-300"
                              : inv.status === "PARTIALLY_PAID"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-200 text-slate-800 border border-slate-300"
                          }`}
                        >
                          {inv.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        {balance > 0 && (
                          <button
                            onClick={() => {
                              setSelectedInvoiceForPay(inv);
                              setPaymentForm((p) => ({ ...p, paymentAmount: balance }));
                              setShowPaymentModal(true);
                            }}
                            className="px-2.5 py-1 rounded bg-black hover:bg-slate-800 text-white text-[11px] font-bold transition-colors"
                          >
                            Record Payment
                          </button>
                        )}

                        {inv.payments?.length > 0 && (
                          <button
                            onClick={() => {
                              const latestPayment = inv.payments[0];
                              setSelectedReceipt({
                                receiptNumber: latestPayment.receiptNumber,
                                studentName: inv.student?.user?.fullName,
                                regNo: inv.student?.registrationNumber,
                                title: inv.title,
                                amountPaid: latestPayment.amount,
                                totalInvoice: inv.totalAmount,
                                newPaidTotal: inv.paidAmount,
                                method: latestPayment.paymentMethod,
                                reference: latestPayment.reference,
                                date: latestPayment.paidAt,
                              });
                            }}
                            className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Receipt</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-slate-500">
                      No invoices found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Issue Student Invoice */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-black">
                Issue Student Invoice
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Generate official tuition bill or material fee
              </p>

              {error && (
                <div className="mb-3 p-2 rounded bg-slate-100 border border-slate-300 text-xs text-black">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateInvoice} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Select Enrolled Student *
                  </label>
                  <select
                    value={invoiceForm.studentId}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-black focus:outline-none focus:border-blue-600"
                  >
                    {students.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.user?.fullName} ({s.registrationNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Invoice Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.title}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, title: e.target.value })}
                    placeholder="e.g. Second Term Tuition & Study Materials"
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-black focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Total Amount (₦ Naira) *
                  </label>
                  <input
                    type="number"
                    required
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-black focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(false)}
                    className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    {saving ? "Generating..." : "Generate Invoice"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Record Payment (Installment or Full) */}
        {showPaymentModal && selectedInvoiceForPay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 shadow-xl relative">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-black">
                Record Student Payment
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Record cash, transfer, or POS payment for Invoice {selectedInvoiceForPay.invoiceNumber}
              </p>

              {error && (
                <div className="mb-3 p-2 rounded bg-slate-100 border border-slate-300 text-xs text-black">
                  {error}
                </div>
              )}

              <div className="mb-4 p-3 rounded bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-black">{selectedInvoiceForPay.student?.user?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Billed:</span>
                  <span className="font-semibold text-black">{formatNaira(selectedInvoiceForPay.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Balance Due:</span>
                  <span className="font-bold text-blue-600">
                    {formatNaira(selectedInvoiceForPay.totalAmount - selectedInvoiceForPay.paidAmount)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Payment Amount Received (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    value={paymentForm.paymentAmount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentAmount: Number(e.target.value) })}
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-black focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Payment Method *
                  </label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-black focus:outline-none focus:border-blue-600"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (GTB, Zenith, OPay, etc.)</option>
                    <option value="CASH">Cash Payment at Desk</option>
                    <option value="POS">POS Terminal Card Payment</option>
                    <option value="ONLINE_PAYSTACK">Online Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Bank Reference / Session ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TRF/9823489102"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-black focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    Internal Accounting Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paid by father via mobile app"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs text-black focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded bg-black hover:bg-slate-800 text-white text-xs font-bold"
                  >
                    {saving ? "Recording..." : "Record & Print Receipt"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Official Printed Receipt View */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white border-2 border-slate-300 rounded-lg w-full max-w-lg p-7 shadow-2xl relative">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Printable Receipt Card */}
              <div id="official-receipt" className="space-y-4">
                {/* Header */}
                <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
                  <div className="w-10 h-10 rounded bg-black text-white flex items-center justify-center font-bold mx-auto mb-2">
                    <Building className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-extrabold text-black uppercase tracking-wide">
                    Good Coaching Centre
                  </h2>
                  <p className="text-xs text-slate-500">
                    14 Commercial Avenue, Sabo, Yaba, Lagos State • 08031234567
                  </p>
                  <div className="mt-2 inline-block px-3 py-0.5 rounded bg-slate-100 text-black font-mono font-bold text-xs border border-slate-300">
                    OFFICIAL TUITION PAYMENT RECEIPT
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-semibold">Receipt Number:</span>
                    <span className="font-mono font-bold text-black">{selectedReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-semibold">Payment Date:</span>
                    <span className="text-slate-800">{formatDate(selectedReceipt.date)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-semibold">Candidate Name:</span>
                    <span className="font-bold text-black">{selectedReceipt.studentName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-semibold">Registration Number:</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedReceipt.regNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-semibold">Fee Description:</span>
                    <span className="text-slate-800">{selectedReceipt.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-500 font-semibold">Payment Channel:</span>
                    <span className="text-slate-800">{selectedReceipt.method?.replace("_", " ")}</span>
                  </div>
                  {selectedReceipt.reference && (
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500 font-semibold">Bank Reference:</span>
                      <span className="font-mono text-slate-800">{selectedReceipt.reference}</span>
                    </div>
                  )}
                </div>

                {/* Financial Summary Box */}
                <div className="bg-slate-50 border border-slate-300 rounded p-3 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Invoiced:</span>
                    <span className="font-semibold">{formatNaira(selectedReceipt.totalInvoice)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-black border-t border-slate-200 pt-1">
                    <span>Amount Paid (This Receipt):</span>
                    <span className="text-blue-700">{formatNaira(selectedReceipt.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-200">
                    <span className="font-semibold">Remaining Balance Due:</span>
                    <span className="font-bold">
                      {formatNaira(selectedReceipt.totalInvoice - selectedReceipt.newPaidTotal)}
                    </span>
                  </div>
                </div>

                {/* Footer Signoff */}
                <div className="pt-2 text-center text-[11px] text-slate-500">
                  <p>Certified by Good Coaching Centre Administration.</p>
                  <p className="mt-0.5">Retain this official receipt for verification.</p>
                </div>
              </div>

              {/* Print Actions */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded bg-black hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
