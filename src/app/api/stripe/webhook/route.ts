import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.customer && session.subscription) {
        await prisma.user.updateMany({
          where: { stripeCustomerId: session.customer as string },
          data: {
            plan: "PRO",
            creditsRemaining: 500,
            stripeSubId: session.subscription as string,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeSubId: sub.id },
        data: {
          plan: "FREE",
          stripeSubId: null,
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subId = (invoice as any).subscription as string | null;
      if (subId) {
        // Reset credits on renewal
        await prisma.user.updateMany({
          where: { stripeSubId: subId },
          data: {
            creditsRemaining: 500,
            creditsResetAt: new Date(),
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
