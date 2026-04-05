import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canActivateWorkflow } from "@/lib/credits";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { workflowSlug, config } = await req.json();

  const workflow = await prisma.workflow.findUnique({
    where: { slug: workflowSlug },
  });
  if (!workflow) {
    return NextResponse.json({ error: "Workflow introuvable" }, { status: 404 });
  }

  // Check if user can activate more workflows
  const existing = await prisma.userWorkflow.findUnique({
    where: {
      userId_workflowId: {
        userId: session.user.id,
        workflowId: workflow.id,
      },
    },
  });

  if (!existing || !existing.isActive) {
    const canActivate = await canActivateWorkflow(session.user.id);
    if (!canActivate) {
      return NextResponse.json(
        { error: "Limite de workflows atteinte. Passez Pro pour en activer plus." },
        { status: 403 }
      );
    }
  }

  // Calculate next run for scheduled workflows
  let nextRunAt: Date | null = null;
  if (workflow.frequency !== "on_demand") {
    nextRunAt = new Date();
    if (workflow.frequency === "daily") {
      nextRunAt.setDate(nextRunAt.getDate() + 1);
      nextRunAt.setHours(8, 0, 0, 0);
    } else if (workflow.frequency === "weekly") {
      nextRunAt.setDate(nextRunAt.getDate() + 7);
    } else if (workflow.frequency === "monthly") {
      nextRunAt.setMonth(nextRunAt.getMonth() + 1);
    }
  }

  const userWorkflow = await prisma.userWorkflow.upsert({
    where: {
      userId_workflowId: {
        userId: session.user.id,
        workflowId: workflow.id,
      },
    },
    update: {
      config,
      isActive: true,
      nextRunAt,
    },
    create: {
      userId: session.user.id,
      workflowId: workflow.id,
      config,
      isActive: true,
      nextRunAt,
    },
  });

  return NextResponse.json({ success: true, userWorkflow });
}
