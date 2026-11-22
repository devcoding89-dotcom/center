import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.centreId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all students for this centre
  const studentMemberships = await prisma.membership.findMany({
    where: { centreId: context.centreId, role: "STUDENT" },
    select: { userId: true },
  });

  const studentUserIds = studentMemberships.map((m) => m.userId);

  const students = await prisma.studentProfile.findMany({
    where: { userId: { in: studentUserIds } },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          isActive: true,
        },
      },
      enrollments: {
        include: {
          classBatch: {
            select: { id: true, name: true },
          },
        },
      },
      invoices: {
        select: { id: true, totalAmount: true, paidAmount: true, status: true },
      },
    },
    orderBy: { enrollmentDate: "desc" },
  });

  return NextResponse.json({ students });
}

export async function POST(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.centreId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      targetExam = "JAMB_UTME",
      targetCourse,
      targetInstitution,
      guardianName,
      guardianPhone,
      classBatchId,
      initialTuition = 0,
    } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    // Default password for new student
    const defaultPassword = await hashPassword("Student2026!");

    // Generate unique Registration Number
    const count = await prisma.studentProfile.count();
    const regNo = `EXS/2026/${String(count + 1).padStart(3, "0")}`;

    const student = await prisma.$transaction(async (tx) => {
      // 1. Create or connect user
      let user = await tx.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            email: email.toLowerCase().trim(),
            fullName: fullName.trim(),
            phoneNumber: phone || null,
            passwordHash: defaultPassword,
            isActive: true,
          },
        });
      }

      // 2. Add membership in this centre
      await tx.membership.upsert({
        where: {
          userId_centreId: {
            userId: user.id,
            centreId: context.centreId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          centreId: context.centreId,
          role: "STUDENT",
          isPrimary: true,
        },
      });

      // 3. Create or update StudentProfile
      let profile = await tx.studentProfile.findUnique({
        where: { userId: user.id },
      });

      if (!profile) {
        profile = await tx.studentProfile.create({
          data: {
            userId: user.id,
            registrationNumber: regNo,
            targetExam,
            targetCourse: targetCourse || null,
            targetInstitution: targetInstitution || null,
            guardianName: guardianName || null,
            guardianPhone: guardianPhone || null,
          },
        });
      }

      // 4. Enroll into ClassBatch if chosen
      if (classBatchId) {
        await tx.classEnrollment.upsert({
          where: {
            studentId_classBatchId: {
              studentId: profile.id,
              classBatchId,
            },
          },
          update: {},
          create: {
            studentId: profile.id,
            classBatchId,
            status: "ACTIVE",
          },
        });
      }

      // 5. Generate initial invoice if fee specified
      if (initialTuition > 0) {
        await tx.invoice.create({
          data: {
            centreId: context.centreId,
            studentId: profile.id,
            invoiceNumber: `INV/2026/${String(count + 1).padStart(3, "0")}`,
            title: `Term Tuition (${targetExam.replace("_", " ")})`,
            totalAmount: Number(initialTuition),
            paidAmount: 0,
            status: "UNPAID",
          },
        });
      }

      // 6. Audit log
      await tx.auditLog.create({
        data: {
          centreId: context.centreId,
          userId: context.userId,
          action: "STUDENT_ENROLLED",
          details: `Enrolled student ${user.fullName} (${regNo})`,
        },
      });

      return profile;
    });

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Student enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to enroll student" },
      { status: 500 }
    );
  }
}
