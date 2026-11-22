import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "coaching-portal-jwt-secret-secure-key-2026-nigeria"
);

// StudyMate destination URL (default local port 3001 or configured URL)
const STUDYMATE_URL = process.env.STUDYMATE_URL || "http://localhost:3001";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve student profile and membership
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        studentProfile: {
          include: {
            enrollments: {
              include: { classBatch: true },
            },
          },
        },
        memberships: {
          where: { isActive: true },
          include: { centre: true },
        },
      },
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: "Only enrolled students can launch StudyMate" },
        { status: 403 }
      );
    }

    const activeMembership = user.memberships[0];
    if (!activeMembership) {
      return NextResponse.json(
        { error: "No active coaching centre membership found" },
        { status: 403 }
      );
    }

    const centre = activeMembership.centre;

    // Issue a short-lived (60s) Single Sign-On launch token
    const token = await new SignJWT({
      sub: user.id,
      studentId: user.studentProfile.id,
      registrationNumber: user.studentProfile.registrationNumber,
      fullName: user.fullName,
      email: user.email,
      centreId: centre.id,
      centreName: centre.name,
      centreSlug: centre.slug,
      targetExam: user.studentProfile.targetExam,
      enrolledBatches: user.studentProfile.enrollments.map((e) => e.classBatch.name),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuer("coaching-centre-portal")
      .setAudience("studymate")
      .setIssuedAt()
      .setExpirationTime("60s")
      .sign(JWT_SECRET);

    // Update last SSO launch timestamp
    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: { lastSsoAt: new Date() },
    });

    // Record SSO launch in audit log
    await prisma.auditLog.create({
      data: {
        centreId: centre.id,
        userId: user.id,
        action: "STUDYMATE_SSO_LAUNCH",
        details: `Single Sign-On initiated for student ${user.fullName} (${user.studentProfile.registrationNumber})`,
      },
    });

    // Destination SSO launch URL
    const launchUrl = `${STUDYMATE_URL}/api/auth/sso/callback?token=${token}`;

    return NextResponse.json({
      success: true,
      token,
      launchUrl,
      targetDestination: STUDYMATE_URL,
      student: {
        name: user.fullName,
        regNo: user.studentProfile.registrationNumber,
        centre: centre.name,
      },
    });
  } catch (error) {
    console.error("SSO launch error:", error);
    return NextResponse.json(
      { error: "Failed to generate StudyMate SSO session" },
      { status: 500 }
    );
  }
}
