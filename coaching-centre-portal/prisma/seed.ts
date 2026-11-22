import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(pass: string): Promise<string> {
  return bcrypt.hash(pass, 10);
}

async function main() {
  console.log("🌱 Seeding Coaching Centre Platform & Super Admin...");

  // 0. Super Admin Account
  const superAdminPass = await hashPassword("SuperAdmin2026!");
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@stoics.ng" },
    update: {
      fullName: "Platform Super Admin",
      isSuperAdmin: true,
      passwordHash: superAdminPass,
      isActive: true,
    },
    create: {
      email: "admin@stoics.ng",
      fullName: "Platform Super Admin",
      phoneNumber: "08099887766",
      isSuperAdmin: true,
      passwordHash: superAdminPass,
      isActive: true,
    },
  });

  // 0b. Subscription Plans
  const plans = [
    {
      name: "Starter",
      code: "STARTER",
      description: "Ideal for emerging tutorial centres and single-hall coaching hubs.",
      priceNgn: 5000,
      billingInterval: "MONTHLY",
      studentLimit: 50,
      staffLimit: 3,
      featuresJson: JSON.stringify(["Student Management", "Attendance Tracking", "Timetable Management", "StudyMate SSO Integration", "WhatsApp Receipts"]),
      isActive: true,
      isPublic: true,
    },
    {
      name: "Standard",
      code: "STANDARD",
      description: "Our most popular tier for established coaching institutes preparing JAMB/WAEC students.",
      priceNgn: 10000,
      billingInterval: "MONTHLY",
      studentLimit: 150,
      staffLimit: 10,
      featuresJson: JSON.stringify(["All Starter Features", "Up to 150 Students", "Fee Tracking & Invoicing", "StudyMate CBT Analytics", "Teacher Announcements", "Dedicated Support"]),
      isActive: true,
      isPublic: true,
    },
    {
      name: "Premium",
      code: "PREMIUM",
      description: "Full suite for large multi-batch academy centres with extensive student populations.",
      priceNgn: 20000,
      billingInterval: "MONTHLY",
      studentLimit: 500,
      staffLimit: 25,
      featuresJson: JSON.stringify(["All Standard Features", "Up to 500 Students", "Multi-Campus Branch Mgmt", "Advanced SaaS Analytics", "Custom Center Branding", "Priority Support Desk"]),
      isActive: true,
      isPublic: true,
    },
    {
      name: "Enterprise",
      code: "ENTERPRISE",
      description: "Bespoke platform deployment for state-wide tutorial networks and educational franchises.",
      priceNgn: 50000,
      billingInterval: "MONTHLY",
      studentLimit: 2000,
      staffLimit: 100,
      featuresJson: JSON.stringify(["Unlimited Scaling", "Custom Subdomain & Domain", "Dedicated Database Tenant", "SLA Guarantee", "24/7 Telephone Concierge"]),
      isActive: true,
      isPublic: false,
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
  }

  // 1. Create the primary coaching centre: Good Coaching Centre
  const centre = await prisma.centre.upsert({
    where: { slug: "good-centre" },
    update: {
      name: "Good Coaching Centre",
      email: "director@goodcentre.ng",
      phone: "08031234567",
      address: "14 Commercial Avenue, Sabo",
      city: "Yaba",
      state: "Lagos State",
      status: "ACTIVE",
      academicSession: "2026/2027",
    },
    create: {
      name: "Good Coaching Centre",
      slug: "good-centre",
      registrationNo: "RC-7849201",
      email: "director@goodcentre.ng",
      phone: "08031234567",
      address: "14 Commercial Avenue, Sabo",
      city: "Yaba",
      state: "Lagos State",
      status: "ACTIVE",
      academicSession: "2026/2027",
    },
  });

  // 2. Main Campus Branch
  const branch = await prisma.branch.create({
    data: {
      centreId: centre.id,
      name: "Main Campus - Yaba",
      address: "14 Commercial Avenue, Yaba, Lagos",
      phone: "08031234567",
    },
  });

  // 3. Centre Subscription (Owner's subscription covering the entire centre & StudyMate access for enrolled students)
  await prisma.centreSubscription.upsert({
    where: { centreId: centre.id },
    update: {
      tier: "STANDARD",
      status: "ACTIVE",
      maxStudents: 150,
      monthlyFeeNgn: 10000,
    },
    create: {
      centreId: centre.id,
      tier: "STANDARD",
      status: "ACTIVE",
      maxStudents: 150,
      monthlyFeeNgn: 10000,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // 4. Centre Owner Account
  const ownerPass = await hashPassword("GoodCentre2026!");
  const owner = await prisma.user.upsert({
    where: { email: "owner@goodcentre.ng" },
    update: { fullName: "Dr. Babatunde Ogunlesi", passwordHash: ownerPass },
    create: {
      email: "owner@goodcentre.ng",
      fullName: "Dr. Babatunde Ogunlesi",
      phoneNumber: "08033445566",
      passwordHash: ownerPass,
      isActive: true,
    },
  });

  await prisma.membership.upsert({
    where: { userId_centreId: { userId: owner.id, centreId: centre.id } },
    update: { role: "CENTRE_OWNER" },
    create: {
      userId: owner.id,
      centreId: centre.id,
      role: "CENTRE_OWNER",
      isPrimary: true,
    },
  });

  // 5. Centre Manager
  const managerPass = await hashPassword("Manager2026!");
  const manager = await prisma.user.upsert({
    where: { email: "manager@goodcentre.ng" },
    update: { fullName: "Mrs. Funke Akindele", passwordHash: managerPass },
    create: {
      email: "manager@goodcentre.ng",
      fullName: "Mrs. Funke Akindele",
      phoneNumber: "08055667788",
      passwordHash: managerPass,
      isActive: true,
    },
  });

  await prisma.membership.upsert({
    where: { userId_centreId: { userId: manager.id, centreId: centre.id } },
    update: { role: "CENTRE_MANAGER" },
    create: {
      userId: manager.id,
      centreId: centre.id,
      role: "CENTRE_MANAGER",
      isPrimary: true,
    },
  });

  // 6. Lead Tutor (Teacher)
  const teacherPass = await hashPassword("Teacher2026!");
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@goodcentre.ng" },
    update: { fullName: "Mr. Samuel Okon", passwordHash: teacherPass },
    create: {
      email: "teacher@goodcentre.ng",
      fullName: "Mr. Samuel Okon",
      phoneNumber: "08099001122",
      passwordHash: teacherPass,
      isActive: true,
      staffProfile: {
        create: {
          staffCode: "STF/GCC/001",
          specialization: "Senior Physics & Mathematics Lead Tutor",
          qualification: "B.Sc (Ed) Physics, Unilag",
        },
      },
    },
  });

  await prisma.membership.upsert({
    where: { userId_centreId: { userId: teacher.id, centreId: centre.id } },
    update: { role: "TEACHER" },
    create: {
      userId: teacher.id,
      centreId: centre.id,
      role: "TEACHER",
      isPrimary: true,
    },
  });

  // 7. Accountant
  const accountantPass = await hashPassword("Accountant2026!");
  const accountant = await prisma.user.upsert({
    where: { email: "accountant@goodcentre.ng" },
    update: { fullName: "Mr. Emeka Obi", passwordHash: accountantPass },
    create: {
      email: "accountant@goodcentre.ng",
      fullName: "Mr. Emeka Obi",
      phoneNumber: "08077889900",
      passwordHash: accountantPass,
      isActive: true,
    },
  });

  await prisma.membership.upsert({
    where: { userId_centreId: { userId: accountant.id, centreId: centre.id } },
    update: { role: "ACCOUNTANT" },
    create: {
      userId: accountant.id,
      centreId: centre.id,
      role: "ACCOUNTANT",
      isPrimary: true,
    },
  });

  // 8. Academic Programmes
  const progJamb = await prisma.programme.create({
    data: {
      centreId: centre.id,
      name: "JAMB UTME 2026 Intensive",
      code: "JAMB-2026",
      description: "Comprehensive 4-subject syllabus prep and StudyMate CBT practice",
      examCategory: "JAMB_UTME",
    },
  });

  const progWaec = await prisma.programme.create({
    data: {
      centreId: centre.id,
      name: "WAEC/NECO Complete Science",
      code: "WAEC-SCI-2026",
      description: "Theory, objective questions, and laboratory practical masterclasses",
      examCategory: "WAEC_SSCE",
    },
  });

  // 9. Class Batches
  const batchAlpha = await prisma.classBatch.create({
    data: {
      centreId: centre.id,
      branchId: branch.id,
      programmeId: progJamb.id,
      name: "JAMB Morning Alpha Batch",
      schedule: "Mon - Thu: 8:30 AM - 1:30 PM",
      capacity: 50,
      roomNumber: "Hall A1",
    },
  });

  const batchWeekend = await prisma.classBatch.create({
    data: {
      centreId: centre.id,
      branchId: branch.id,
      programmeId: progWaec.id,
      name: "WAEC Weekend Intensive",
      schedule: "Saturdays 9:00 AM - 4:00 PM",
      capacity: 40,
      roomNumber: "Hall B2",
    },
  });

  // 10. Subjects
  const subEng = await prisma.subject.create({
    data: { centreId: centre.id, name: "Use of English", code: "ENG" },
  });
  const subMth = await prisma.subject.create({
    data: { centreId: centre.id, name: "General Mathematics", code: "MTH" },
  });
  const subPhy = await prisma.subject.create({
    data: { centreId: centre.id, name: "Physics", code: "PHY" },
  });
  const subChm = await prisma.subject.create({
    data: { centreId: centre.id, name: "Chemistry", code: "CHM" },
  });
  const subBio = await prisma.subject.create({
    data: { centreId: centre.id, name: "Biology", code: "BIO" },
  });

  // 11. Timetable Slots
  await prisma.timetableSlot.createMany({
    data: [
      {
        centreId: centre.id,
        classBatchId: batchAlpha.id,
        subjectId: subEng.id,
        dayOfWeek: 1, // Monday
        startTime: "08:30",
        endTime: "10:00",
        teacherName: "Mrs. Akindele",
        room: "Hall A1",
      },
      {
        centreId: centre.id,
        classBatchId: batchAlpha.id,
        subjectId: subMth.id,
        dayOfWeek: 1, // Monday
        startTime: "10:15",
        endTime: "11:45",
        teacherName: "Mr. Samuel Okon",
        room: "Hall A1",
      },
      {
        centreId: centre.id,
        classBatchId: batchAlpha.id,
        subjectId: subPhy.id,
        dayOfWeek: 1, // Monday
        startTime: "12:00",
        endTime: "01:30",
        teacherName: "Mr. Samuel Okon",
        room: "Hall A1",
      },
    ],
  });

  // 12. Fee Structure
  const feeTuition = await prisma.feeStructure.create({
    data: {
      centreId: centre.id,
      name: "Full Term Tuition (Includes StudyMate Access)",
      amount: 45000,
      category: "TUITION",
    },
  });

  // 13. Student 1: Chinedu Eze
  const studentPass = await hashPassword("Student2026!");
  const student1 = await prisma.user.upsert({
    where: { email: "chinedu@student.ng" },
    update: { fullName: "Chinedu Eze", passwordHash: studentPass },
    create: {
      email: "chinedu@student.ng",
      fullName: "Chinedu Eze",
      phoneNumber: "08123456701",
      passwordHash: studentPass,
      isActive: true,
      studentProfile: {
        create: {
          registrationNumber: "GCC/2026/001",
          targetExam: "JAMB_UTME",
          targetCourse: "Medicine & Surgery",
          targetInstitution: "University of Lagos (UNILAG)",
          guardianName: "Chief Patrick Eze",
          guardianPhone: "08039999001",
          studyMateId: "sm_usr_chinedu_001",
        },
      },
    },
  });

  await prisma.membership.upsert({
    where: { userId_centreId: { userId: student1.id, centreId: centre.id } },
    update: { role: "STUDENT" },
    create: {
      userId: student1.id,
      centreId: centre.id,
      role: "STUDENT",
      isPrimary: true,
    },
  });

  const studentProfile1 = await prisma.studentProfile.findUnique({
    where: { userId: student1.id },
  });

  if (studentProfile1) {
    // Enroll in Batch Alpha
    await prisma.classEnrollment.upsert({
      where: {
        studentId_classBatchId: {
          studentId: studentProfile1.id,
          classBatchId: batchAlpha.id,
        },
      },
      update: {},
      create: {
        studentId: studentProfile1.id,
        classBatchId: batchAlpha.id,
        status: "ACTIVE",
      },
    });

    // Invoice for Student 1
    const inv1 = await prisma.invoice.create({
      data: {
        centreId: centre.id,
        studentId: studentProfile1.id,
        feeStructureId: feeTuition.id,
        invoiceNumber: "INV/GCC/2026/001",
        title: "Full Term Tuition & Learning Materials",
        totalAmount: 45000,
        paidAmount: 30000,
        status: "PARTIALLY_PAID",
      },
    });

    // Partial Payment
    await prisma.payment.create({
      data: {
        centreId: centre.id,
        invoiceId: inv1.id,
        receiptNumber: "RCP/GCC/2026/001",
        amount: 30000,
        paymentMethod: "BANK_TRANSFER",
        reference: "GTB-TRF-98231023",
        notes: "First installment paid via bank transfer",
        recordedBy: "Mr. Emeka Obi",
      },
    });
  }

  // 14. Attendance Sessions
  const session1 = await prisma.attendanceSession.create({
    data: {
      centreId: centre.id,
      classBatchId: batchAlpha.id,
      topicCovered: "Newtonian Mechanics & Motion Equations",
      recordedById: teacher.id,
      sessionDate: new Date(),
    },
  });

  if (studentProfile1) {
    await prisma.attendanceRecord.create({
      data: {
        attendanceSessionId: session1.id,
        studentId: studentProfile1.id,
        status: "PRESENT",
        remarks: "Punctual and active in problem solving",
      },
    });
  }

  // 15. Announcements
  await prisma.announcement.create({
    data: {
      centreId: centre.id,
      title: "StudyMate CBT Practice Sessions are Live!",
      content:
        "All registered Good Coaching Centre candidates can now launch StudyMate directly from their dashboard to practice JAMB past questions and receive AI tutoring. No separate subscription is required.",
      audience: "ALL",
      isPinned: true,
    },
  });

  await prisma.announcement.create({
    data: {
      centreId: centre.id,
      title: "Saturday Diagnostic Mock Test",
      content:
        "Full simulation test starts Saturday at 9:00 AM sharp in Hall A1. Check your timetable for seat number allocations.",
      audience: "STUDENTS",
      isPinned: false,
    },
  });

  // 16. Sample Notifications for Student
  await prisma.notification.createMany({
    data: [
      {
        centreId: centre.id,
        userId: student1.id,
        title: "Attendance Recorded",
        message: "Your attendance for JAMB Morning Alpha (Physics) has been marked as Present.",
        type: "ATTENDANCE",
        linkUrl: "/student/attendance",
        isRead: false,
      },
      {
        centreId: centre.id,
        userId: student1.id,
        title: "StudyMate Access Active",
        message: "Your StudyMate CBT practice access has been activated under Good Coaching Centre's plan.",
        type: "GENERAL",
        linkUrl: "/student/dashboard",
        isRead: false,
      },
      {
        centreId: centre.id,
        userId: student1.id,
        title: "Payment Receipt Issued",
        message: "₦35,000 tuition payment confirmed (Receipt #RCP-2026-001).",
        type: "PAYMENT",
        linkUrl: "/student/fees",
        isRead: true,
      },
    ],
  });

  // 17. Sample Support Ticket for Student
  if (studentProfile1) {
    await prisma.supportTicket.create({
      data: {
        centreId: centre.id,
        studentId: studentProfile1.id,
        subject: "Study Material Access for Chemistry Session 2",
        category: "ACADEMIC",
        message: "Hello, I attended Friday's Chemistry session but could not find the handout download link in the portal.",
        status: "IN_PROGRESS",
        adminReply: "Handout has been re-uploaded to the resource desk. Please check your dashboard.",
      },
    });
  }

  // 18. Additional Centres for Platform Multi-Tenancy & Super Admin
  const maxCentre = await prisma.centre.upsert({
    where: { slug: "max-centre" },
    update: { status: "ACTIVE" },
    create: {
      name: "Max Tutorial College",
      slug: "max-centre",
      registrationNo: "RC-9988112",
      email: "principal@maxcentre.ng",
      phone: "08022334455",
      address: "22 Ikorodu Road, Maryland",
      city: "Ikeja",
      state: "Lagos State",
      status: "ACTIVE",
      academicSession: "2026/2027",
    },
  });

  await prisma.centreSubscription.upsert({
    where: { centreId: maxCentre.id },
    update: { tier: "PREMIUM", status: "ACTIVE", monthlyFeeNgn: 20000, maxStudents: 500 },
    create: {
      centreId: maxCentre.id,
      tier: "PREMIUM",
      status: "ACTIVE",
      monthlyFeeNgn: 20000,
      maxStudents: 500,
      currentPeriodEnd: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
  });

  const kidCentre = await prisma.centre.upsert({
    where: { slug: "kid-academy" },
    update: { status: "PENDING_VERIFICATION" },
    create: {
      name: "Kid Elite Academy",
      slug: "kid-academy",
      registrationNo: "RC-4455667",
      email: "admin@kidelite.ng",
      phone: "08133445566",
      address: "8 New Market Road",
      city: "Onitsha",
      state: "Anambra State",
      status: "PENDING_VERIFICATION",
      academicSession: "2026/2027",
    },
  });

  await prisma.centreSubscription.upsert({
    where: { centreId: kidCentre.id },
    update: { tier: "STARTER", status: "TRIAL", monthlyFeeNgn: 5000, maxStudents: 50 },
    create: {
      centreId: kidCentre.id,
      tier: "STARTER",
      status: "TRIAL",
      monthlyFeeNgn: 5000,
      maxStudents: 50,
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  const apexCentre = await prisma.centre.upsert({
    where: { slug: "apex-coaching" },
    update: { status: "SUSPENDED" },
    create: {
      name: "Apex Coaching Hub",
      slug: "apex-coaching",
      registrationNo: "RC-1122334",
      email: "info@apexcoaching.ng",
      phone: "08055667788",
      address: "45 Stadium Road",
      city: "Port Harcourt",
      state: "Rivers State",
      status: "SUSPENDED",
      academicSession: "2026/2027",
    },
  });

  await prisma.centreSubscription.upsert({
    where: { centreId: apexCentre.id },
    update: { tier: "STANDARD", status: "PAST_DUE", monthlyFeeNgn: 10000, maxStudents: 150 },
    create: {
      centreId: apexCentre.id,
      tier: "STANDARD",
      status: "PAST_DUE",
      monthlyFeeNgn: 10000,
      maxStudents: 150,
      currentPeriodEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  // 19. SaaS Payments Ledger (Platform Revenue from Centre Subscriptions)
  await prisma.saasPayment.createMany({
    data: [
      {
        centreId: centre.id,
        planCode: "STANDARD",
        amountNgn: 10000,
        currency: "NGN",
        paymentMethod: "ONLINE_PAYSTACK",
        paystackRef: "pstk_sub_good_2026_01",
        paystackTransId: "trx_990182",
        status: "SUCCESS",
        billingPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        billingPeriodEnd: new Date(Date.now()),
        receiptNumber: "SAAS-RCP-2026-001",
        metadataJson: JSON.stringify({ gateway: "paystack", channel: "card", last4: "4242" }),
      },
      {
        centreId: centre.id,
        planCode: "STANDARD",
        amountNgn: 10000,
        currency: "NGN",
        paymentMethod: "ONLINE_PAYSTACK",
        paystackRef: "pstk_sub_good_2026_02",
        paystackTransId: "trx_990455",
        status: "SUCCESS",
        billingPeriodStart: new Date(),
        billingPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        receiptNumber: "SAAS-RCP-2026-002",
        metadataJson: JSON.stringify({ gateway: "paystack", channel: "card", last4: "4242" }),
      },
      {
        centreId: maxCentre.id,
        planCode: "PREMIUM",
        amountNgn: 20000,
        currency: "NGN",
        paymentMethod: "ONLINE_PAYSTACK",
        paystackRef: "pstk_sub_max_2026_01",
        paystackTransId: "trx_990712",
        status: "SUCCESS",
        billingPeriodStart: new Date(),
        billingPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        receiptNumber: "SAAS-RCP-2026-003",
        metadataJson: JSON.stringify({ gateway: "paystack", channel: "bank_transfer", bank: "Access Bank" }),
      },
    ],
  });

  // 20. Platform Broadcast Announcement
  await prisma.platformAnnouncement.create({
    data: {
      title: "StudyMate Integration v2.4 Live",
      content: "All coaching centres now have direct single sign-on enabled for 2026 JAMB mock CBT practice exams with real-time subject scoring.",
      priority: "NORMAL",
      targetAudience: "ALL",
      createdByAdminId: superAdmin.id,
    },
  });

  // 21. Default Platform Settings
  const defaultSettings = [
    { key: "PLATFORM_NAME", value: "Stoics Educational Institute & Services", category: "BRANDING", description: "Public platform SaaS name" },
    { key: "SUPPORT_EMAIL", value: "support@stoics.ng", category: "GENERAL", description: "Primary customer support desk email" },
    { key: "SUPPORT_PHONE", value: "+234 800 786 427", category: "GENERAL", description: "Inquiry and WhatsApp hotline" },
    { key: "REQUIRE_APPROVAL", value: "true", category: "SECURITY", description: "Whether new centre registrations require super admin verification" },
    { key: "PAYSTACK_LIVE_MODE", value: "false", category: "BILLING", description: "Toggle between Paystack Test and Live mode" },
    { key: "DEFAULT_CURRENCY", value: "NGN", category: "BILLING", description: "Platform default billing currency" },
  ];

  for (const s of defaultSettings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }

  // 22. Audit Log for Super Admin
  await prisma.auditLog.create({
    data: {
      action: "PLATFORM_INITIALIZATION",
      details: "Platform initialized with version 2.4.0. Seeded multi-centre ecosystem and super admin console.",
      user: { connect: { id: superAdmin.id } },
      centre: { connect: { id: centre.id } },
    },
  });

  console.log("✓ Good Coaching Centre & Super Admin platform seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
