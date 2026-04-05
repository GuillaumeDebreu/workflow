import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: { apiKeys: true },
  });

  return (
    <SettingsClient
      user={{
        email: user.email,
        plan: user.plan,
        stripeSubId: user.stripeSubId,
      }}
      apiKeys={user.apiKeys.map((k) => ({
        id: k.id,
        service: k.service,
        keyPreview: k.key.slice(0, 8) + "..." + k.key.slice(-4),
      }))}
    />
  );
}
