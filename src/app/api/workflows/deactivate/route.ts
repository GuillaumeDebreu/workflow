import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  await prisma.userWorkflow.update({
    where: {
      userId_workflowId: {
        userId: session.user.id,
        workflowId: workflow.id,
      },
    },
    data: { isActive: false, nextRunAt: null },
  });

  return NextResponse.json({ success: true });
}
