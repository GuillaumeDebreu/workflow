import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deductCredits, checkAndResetCredits } from "@/lib/credits";

export async function GET(req: NextRequest) {
  // Simple auth for cron - in production use a proper secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || "cron-secret"}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Find all scheduled workflows that need to run
  const dueWorkflows = await prisma.userWorkflow.findMany({
    where: {
      isActive: true,
      nextRunAt: { lte: now },
    },
    include: {
      workflow: true,
      user: true,
    },
  });

  const results = [];

  for (const uw of dueWorkflows) {
    try {
      // Check and reset credits if needed
      const credits = await checkAndResetCredits(uw.userId);
      if (credits < uw.workflow.creditsPerRun) {
        results.push({
          id: uw.id,
          status: "skipped",
          reason: "insufficient credits",
        });
        continue;
      }

      // Create execution
      const execution = await prisma.execution.create({
        data: {
          userWorkflowId: uw.id,
          userId: uw.userId,
          status: "RUNNING",
          creditsUsed: uw.workflow.creditsPerRun,
        },
      });

      await deductCredits(uw.userId, uw.workflow.creditsPerRun);

      // Execute workflow
      const workflowModule = await import(
        `@/workflows/${uw.workflow.slug}/index`
      );
      const apiKeys = await prisma.apiKey.findMany({
        where: { userId: uw.userId },
      });
      const apiKeysMap: Record<string, string> = {};
      for (const k of apiKeys) {
        apiKeysMap[k.service] = k.key;
      }

      const result = await workflowModule.execute(uw.config, apiKeysMap);

      await prisma.execution.update({
        where: { id: execution.id },
        data: { status: "SUCCESS", result, completedAt: new Date() },
      });

      // Calculate next run
      let nextRunAt = new Date();
      if (uw.workflow.frequency === "daily") {
        nextRunAt.setDate(nextRunAt.getDate() + 1);
      } else if (uw.workflow.frequency === "weekly") {
        nextRunAt.setDate(nextRunAt.getDate() + 7);
      } else if (uw.workflow.frequency === "monthly") {
        nextRunAt.setMonth(nextRunAt.getMonth() + 1);
      }

      await prisma.userWorkflow.update({
        where: { id: uw.id },
        data: { lastRunAt: new Date(), nextRunAt },
      });

      results.push({ id: uw.id, status: "success" });
    } catch (error: unknown) {
      results.push({
        id: uw.id,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown",
      });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
