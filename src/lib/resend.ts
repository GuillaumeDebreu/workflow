import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWorkflowResult(
  to: string,
  subject: string,
  html: string
) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@autoflow.io",
    to,
    subject,
    html,
  });
}
