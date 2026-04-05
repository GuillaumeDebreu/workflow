import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deductCredits, checkAndResetCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 });
  }

  const { workflowSlug } = await req.json();

  const workflow = await prisma.workflow.findUnique({
    where: { slug: workflowSlug },
  });
  if (!workflow) {
    return NextResponse.json({ error: "Workflow introuvable" }, { status: 404 });
  }

  const userWorkflow = await prisma.userWorkflow.findUnique({
    where: {
      userId_workflowId: {
        userId: session.user.id,
        workflowId: workflow.id,
      },
    },
  });
  if (!userWorkflow || !userWorkflow.isActive) {
    return NextResponse.json(
      { error: "Workflow non active" },
      { status: 400 }
    );
  }

  // Check credits
  const credits = await checkAndResetCredits(session.user.id);
  if (credits < workflow.creditsPerRun) {
    return NextResponse.json(
      {
        error:
          "Credits insuffisants. Passez Pro ou attendez le reset mensuel.",
      },
      { status: 402 }
    );
  }

  // Create execution record
  const execution = await prisma.execution.create({
    data: {
      userWorkflowId: userWorkflow.id,
      userId: session.user.id,
      status: "PENDING",
      creditsUsed: workflow.creditsPerRun,
    },
  });

  // Deduct credits and execute
  try {
    await deductCredits(session.user.id, workflow.creditsPerRun);

    await prisma.execution.update({
      where: { id: execution.id },
      data: { status: "RUNNING" },
    });

    // Dynamically import and execute the workflow
    const workflowModule = await import(
      `@/workflows/${workflow.slug}/index`
    );

    // Get user's API keys
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
    });
    const apiKeysMap: Record<string, string> = {};
    for (const k of apiKeys) {
      apiKeysMap[k.service] = k.key;
    }

    const result = await workflowModule.execute(
      userWorkflow.config,
      apiKeysMap
    );

    await prisma.execution.update({
      where: { id: execution.id },
      data: {
        status: "SUCCESS",
        result,
        completedAt: new Date(),
      },
    });

    await prisma.userWorkflow.update({
      where: { id: userWorkflow.id },
      data: { lastRunAt: new Date() },
    });

    return NextResponse.json({ success: true, executionId: execution.id });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";

    await prisma.execution.update({
      where: { id: execution.id },
      data: {
        status: "FAILED",
        error: errorMessage,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(
      { error: "Execution echouee: " + errorMessage },
      { status: 500 }
    );
  }
}
