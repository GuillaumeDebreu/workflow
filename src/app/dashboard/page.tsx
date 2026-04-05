import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: {
      activeWorkflows: {
        include: { workflow: true },
        orderBy: { createdAt: "desc" },
      },
      executions: {
        orderBy: { startedAt: "desc" },
        take: 20,
        include: {
          userWorkflow: { include: { workflow: true } },
        },
      },
    },
  });

  const totalCredits = user.plan === "FREE" ? 100 : 500;

  return (
    <DashboardClient
      user={{
        plan: user.plan,
        creditsRemaining: user.creditsRemaining,
        totalCredits,
        email: user.email,
      }}
      activeWorkflows={user.activeWorkflows.map((uw) => ({
        id: uw.id,
        slug: uw.workflow.slug,
        name: uw.workflow.name,
        icon: uw.workflow.icon,
        isActive: uw.isActive,
        frequency: uw.workflow.frequency,
        creditsPerRun: uw.workflow.creditsPerRun,
        lastRunAt: uw.lastRunAt?.toISOString() || null,
        nextRunAt: uw.nextRunAt?.toISOString() || null,
      }))}
      executions={user.executions.map((ex) => ({
        id: ex.id,
        workflowName: ex.userWorkflow.workflow.name,
        workflowIcon: ex.userWorkflow.workflow.icon,
        status: ex.status,
        creditsUsed: ex.creditsUsed,
        startedAt: ex.startedAt.toISOString(),
        completedAt: ex.completedAt?.toISOString() || null,
      }))}
    />
  );
}
