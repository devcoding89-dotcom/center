import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const context = await getTenantContext();
  if (!context || !context.centreId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const batches = await prisma.classBatch.findMany({
    where: { centreId: context.centreId },
    include: {
      programme: true,
      branch: true,
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const programmes = await prisma.programme.findMany({
    where: { centreId: context.centreId, isActive: true },
  });

  return NextResponse.json({ batches, programmes });
}

export async function POST(request: Request) {
  const context = await getTenantContext();
  if (!context || !context.centreId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, programmeId, schedule, capacity = 40, roomNumber } = body;

    if (!name || !programmeId) {
      return NextResponse.json(
        { error: "Batch name and programme are required" },
        { status: 400 }
      );
    }

    const batch = await prisma.classBatch.create({
      data: {
        centreId: context.centreId,
        programmeId,
        name: name.trim(),
        schedule: schedule?.trim() || null,
        capacity: Number(capacity),
        roomNumber: roomNumber?.trim() || null,
      },
      include: { programme: true },
    });

    return NextResponse.json({ success: true, batch });
  } catch (error) {
    console.error("Create batch error:", error);
    return NextResponse.json({ error: "Failed to create batch" }, { status: 500 });
  }
}
