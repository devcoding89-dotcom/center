import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.centreId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { centreId } = context;

  // Retrieve invoices for this centre
  const invoices = await prisma.invoice.findMany({
    where: { centreId },
    include: {
      student: {
        include: {
          user: {
            select: { fullName: true, email: true, phoneNumber: true },
          },
        },
      },
      payments: {
        orderBy: { paidAt: "desc" },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  // Retrieve students for invoice generation modal
  const studentMemberships = await prisma.membership.findMany({
    where: { centreId, role: "STUDENT", isActive: true },
    select: { userId: true },
  });
  const studentUserIds = studentMemberships.map((m) => m.userId);

  const students = await prisma.studentProfile.findMany({
    where: { userId: { in: studentUserIds } },
    include: {
      user: {
        select: { fullName: true, email: true },
      },
    },
  });

  // Calculate accounting totals
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const outstandingBalance = totalInvoiced - totalPaid;

  return NextResponse.json({
    metrics: {
      totalInvoiced,
      totalPaid,
      outstandingBalance,
      invoicesCount: invoices.length,
      collectionRate: totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0,
    },
    invoices,
    students,
  });
}

// Create new invoice (Centre Owner action)
export async function POST(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.centreId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, studentId, title, amount, invoiceId, paymentAmount, paymentMethod, reference, notes } = body;

    // Action 1: Create Invoice
    if (action === "CREATE_INVOICE") {
      if (!studentId || !title || !amount) {
        return NextResponse.json({ error: "Missing required invoice fields" }, { status: 400 });
      }

      const count = await prisma.invoice.count({ where: { centreId: context.centreId } });
      const invoiceNumber = `INV/GCC/2026/${String(count + 1).padStart(3, "0")}`;

      const newInvoice = await prisma.invoice.create({
        data: {
          centreId: context.centreId,
          studentId,
          invoiceNumber,
          title: title.trim(),
          totalAmount: Number(amount),
          paidAmount: 0,
          status: "UNPAID",
        },
      });

      return NextResponse.json({ success: true, invoice: newInvoice });
    }

    // Action 2: Record Payment
    if (action === "RECORD_PAYMENT") {
      if (!invoiceId || !paymentAmount) {
        return NextResponse.json({ error: "Invoice and payment amount required" }, { status: 400 });
      }

      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
      });

      if (!invoice || invoice.centreId !== context.centreId) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }

      const payAmt = Number(paymentAmount);
      const newPaidAmount = invoice.paidAmount + payAmt;
      const newStatus =
        newPaidAmount >= invoice.totalAmount
          ? "PAID"
          : newPaidAmount > 0
          ? "PARTIALLY_PAID"
          : "UNPAID";

      const receiptCount = await prisma.payment.count({ where: { centreId: context.centreId } });
      const receiptNumber = `RCP/GCC/2026/${String(receiptCount + 1).padStart(3, "0")}`;

      const payment = await prisma.$transaction(async (tx) => {
        const p = await tx.payment.create({
          data: {
            centreId: context.centreId,
            invoiceId,
            receiptNumber,
            amount: payAmt,
            paymentMethod: paymentMethod || "BANK_TRANSFER",
            reference: reference || null,
            notes: notes || null,
            recordedBy: context.userFullName,
          },
        });

        await tx.invoice.update({
          where: { id: invoiceId },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus,
          },
        });

        return p;
      });

      return NextResponse.json({ success: true, payment });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Finance API error:", error);
    return NextResponse.json({ error: "Failed to process finance request" }, { status: 500 });
  }
}
