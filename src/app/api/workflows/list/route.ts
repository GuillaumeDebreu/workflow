import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const workflows = await prisma.workflow.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: {
      slug: true,
      name: true,
      description: true,
      category: true,
      creditsPerRun: true,
      icon: true,
      frequency: true,
    },
  });

  return NextResponse.json({ workflows });
}
