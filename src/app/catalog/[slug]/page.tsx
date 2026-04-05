import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import WorkflowDetailClient from "./WorkflowDetailClient";

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workflow = await prisma.workflow.findUnique({ where: { slug } });
  if (!workflow) notFound();

  const session = await getServerSession(authOptions);
  let userWorkflow = null;

  if (session?.user?.id) {
    userWorkflow = await prisma.userWorkflow.findUnique({
      where: {
        userId_workflowId: {
          userId: session.user.id,
          workflowId: workflow.id,
        },
      },
    });
  }

  return (
    <WorkflowDetailClient
      workflow={{
        slug: workflow.slug,
        name: workflow.name,
        description: workflow.description,
        longDescription: workflow.longDescription,
        category: workflow.category,
        creditsPerRun: workflow.creditsPerRun,
        frequency: workflow.frequency,
        icon: workflow.icon,
        features: workflow.features,
        integrations: workflow.integrations,
        configSchema: workflow.configSchema as Record<string, unknown>,
      }}
      isAuthenticated={!!session}
      existingConfig={
        userWorkflow ? (userWorkflow.config as Record<string, unknown>) : undefined
      }
      isActive={userWorkflow?.isActive || false}
    />
  );
}
