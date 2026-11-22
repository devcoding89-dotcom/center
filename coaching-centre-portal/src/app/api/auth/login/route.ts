import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        memberships: {
          where: { isActive: true },
          include: {
            centre: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid credentials or account is inactive" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Determine initial active centre & role
    const primaryMembership =
      user.memberships.find((m) => m.isPrimary) || user.memberships[0];

    const activeCentreId = primaryMembership ? primaryMembership.centreId : undefined;
    const activeRole = primaryMembership ? primaryMembership.role : (user.isSuperAdmin ? "SUPER_ADMIN" : "USER");

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      isSuperAdmin: user.isSuperAdmin,
      activeCentreId,
      activeRole,
    });

    // Record login in audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        centreId: activeCentreId,
        action: "USER_LOGIN",
        details: `Successful sign in for ${user.email} (${activeRole})`,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isSuperAdmin: user.isSuperAdmin,
        activeCentreId,
        activeRole,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
