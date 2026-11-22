import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      centreName,
      slug,
      email,
      phone,
      state,
      city,
      address,
      ownerFullName,
      ownerEmail,
      ownerPassword,
      ownerPhone,
      subscriptionTier = "STANDARD",
    } = body;

    if (!centreName || !ownerFullName || !ownerEmail || !ownerPassword) {
      return NextResponse.json(
        { error: "Centre name, owner name, owner email, and password are required" },
        { status: 400 }
      );
    }

    // Auto-generate clean slug if not explicitly passed
    const generatedSlug = (slug || centreName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check slug uniqueness
    const existingCentre = await prisma.centre.findUnique({
      where: { slug: generatedSlug },
    });

    if (existingCentre) {
      return NextResponse.json(
        { error: "A centre with this identifier or name already exists. Please choose another." },
        { status: 409 }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: ownerEmail.toLowerCase().trim() },
    });

    if (user) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in first." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(ownerPassword);

    // Create User, Centre, Branch, Subscription, and Membership inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Owner User
      const newUser = await tx.user.create({
        data: {
          email: ownerEmail.toLowerCase().trim(),
          fullName: ownerFullName.trim(),
          phoneNumber: ownerPhone || phone || null,
          passwordHash,
          isActive: true,
        },
      });

      // 2. Create Centre
      const newCentre = await tx.centre.create({
        data: {
          name: centreName.trim(),
          slug: generatedSlug,
          email: email?.trim() || ownerEmail.trim(),
          phone: phone?.trim() || ownerPhone?.trim() || "08000000000",
          state: state || "Lagos State",
          city: city || null,
          address: address || null,
          status: "ACTIVE",
          academicSession: "2026/2027",
        },
      });

      // 3. Create Default Main Campus Branch
      await tx.branch.create({
        data: {
          centreId: newCentre.id,
          name: "Main Campus",
          address: address || null,
          phone: phone || null,
        },
      });

      // 4. Create Centre Subscription
      const tierLimits: Record<string, { max: number; fee: number }> = {
        STARTER: { max: 50, fee: 5000 },
        STANDARD: { max: 150, fee: 10000 },
        PREMIUM: { max: 500, fee: 20000 },
        ENTERPRISE: { max: 2000, fee: 50000 },
      };

      const selected = tierLimits[subscriptionTier] || tierLimits.STANDARD;

      await tx.centreSubscription.create({
        data: {
          centreId: newCentre.id,
          tier: subscriptionTier,
          status: "ACTIVE",
          maxStudents: selected.max,
          monthlyFeeNgn: selected.fee,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day starting period
        },
      });

      // 5. Create Owner Membership
      await tx.membership.create({
        data: {
          userId: newUser.id,
          centreId: newCentre.id,
          role: "CENTRE_OWNER",
          isPrimary: true,
        },
      });

      // 6. Pre-seed default Nigerian subjects for the centre
      const defaultSubjects = [
        { name: "Use of English", code: "ENG" },
        { name: "General Mathematics", code: "MTH" },
        { name: "Biology", code: "BIO" },
        { name: "Chemistry", code: "CHM" },
        { name: "Physics", code: "PHY" },
        { name: "Economics", code: "ECO" },
        { name: "Government", code: "GOV" },
        { name: "Literature in English", code: "LIT" },
      ];

      for (const sub of defaultSubjects) {
        await tx.subject.create({
          data: {
            centreId: newCentre.id,
            name: sub.name,
            code: sub.code,
          },
        });
      }

      // 7. Audit log
      await tx.auditLog.create({
        data: {
          centreId: newCentre.id,
          userId: newUser.id,
          action: "CENTRE_REGISTERED",
          details: `Centre "${newCentre.name}" registered with ${subscriptionTier} tier`,
        },
      });

      return { user: newUser, centre: newCentre };
    });

    // Auto sign-in
    await setSessionCookie({
      userId: result.user.id,
      email: result.user.email,
      fullName: result.user.fullName,
      isSuperAdmin: false,
      activeCentreId: result.centre.id,
      activeRole: "CENTRE_OWNER",
    });

    return NextResponse.json({
      success: true,
      centre: result.centre,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
      },
    });
  } catch (error) {
    console.error("Centre registration error:", error);
    return NextResponse.json(
      { error: "Failed to register coaching centre" },
      { status: 500 }
    );
  }
}
