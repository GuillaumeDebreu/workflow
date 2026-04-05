import { prisma } from "./prisma";

const PLAN_CREDITS = {
  FREE: 100,
  PRO: 500,
} as const;

const MAX_ACTIVE_WORKFLOWS = {
  FREE: 2,
  PRO: Infinity,
} as const;

export async function checkAndResetCredits(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const now = new Date();
  const resetAt = new Date(user.creditsResetAt);
  const nextReset = new Date(
    resetAt.getFullYear(),
    resetAt.getMonth() + 1,
    1
  );

  if (now >= nextReset) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsRemaining: PLAN_CREDITS[user.plan],
        creditsResetAt: now,
      },
    });
    return PLAN_CREDITS[user.plan];
  }

  return user.creditsRemaining;
}

export async function deductCredits(userId: string, amount: number) {
  const credits = await checkAndResetCredits(userId);
  if (credits < amount) {
    throw new Error("INSUFFICIENT_CREDITS");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { creditsRemaining: { decrement: amount } },
  });
}

export async function canActivateWorkflow(userId: string): Promise<boolean> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { activeWorkflows: { where: { isActive: true } } },
  });

  return (
    user.activeWorkflows.length < MAX_ACTIVE_WORKFLOWS[user.plan]
  );
}

export { PLAN_CREDITS, MAX_ACTIVE_WORKFLOWS };
