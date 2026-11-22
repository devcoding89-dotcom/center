import { NextResponse } from "next/server";
import { getSession, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetCentreId } = await request.json();
    if (!targetCentreId) {
      return NextResponse.json(
        { error: "targetCentreId is required" },
        { status: 400 }
      );
    }

    // Verify user actually belongs to target centre (unless Super Admin)
    let membershipRole = "CENTRE_OWNER";

    if (!session.isSuperAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_centreId: {
            userId: session.userId,
            centreId: targetCentreId,
          },
        },
        include: { centre: true },
      });

      if (!membership || !membership.isActive || membership.centre.status === "SUSPENDED") {
        return NextResponse.json(
          { error: "Access denied to requested centre" },
          { status: 403 }
        );
      }
      membershipRole = membership.role;
    }

    // Update session cookie with new active centre
    await setSessionCookie({
      ...session,
      activeCentreId: targetCentreId,
      activeRole: session.isSuperAdmin ? "SUPER_ADMIN" : membershipRole,
    });

    return NextResponse.json({
      success: true,
      activeCentreId: targetCentreId,
      activeRole: session.isSuperAdmin ? "SUPER_ADMIN" : membershipRole,
    });
  } catch (error) {
    console.error("Switch centre error:", error);
    return NextResponse.json(
      { error: "Failed to switch centre context" },
      { status: 500 }
    );
  }
}
