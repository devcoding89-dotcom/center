import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";

export async function GET() {
  const context = await getTenantContext();
  if (!context) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: context.userId,
      fullName: context.userFullName,
      email: context.userEmail,
      isSuperAdmin: context.isSuperAdmin,
    },
    activeCentre: {
      id: context.centreId,
      name: context.centreName,
      slug: context.centreSlug,
      role: context.role,
    },
    allMemberships: context.allMemberships,
  });
}
