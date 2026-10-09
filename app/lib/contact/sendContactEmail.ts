import { ContactFormSubmission } from "@/app/domain/contact/ContactFormSubmission";
import { InquiryTypeLabel } from "@/app/domain/contact/InquiryTypeLabel";

const STUDIO_EMAIL = "studio@botmandesign.com";
const FROM_NAME = "Botman Design Website";

interface ComposedEmail {
  subject: string;
  text: string;
  html: string;
}

/*
 * De site draait op twee plekken: als Cloudflare Worker en als gewone Node-
 * server op onze eigen machine. Op Cloudflare gaat de mail via de EMAIL-binding,
 * daarbuiten via SMTP. Welke van de twee beschikbaar is bepaalt de route; is er
 * geen van beide, dan weten we dat meteen in plaats van stilletjes niets te
 * versturen.
 */
export class ContactEmailSender {
  static async send(submission: ContactFormSubmission): Promise<void> {
    const email = compose(submission);

    const binding = await cloudflareEmailBinding();
    if (binding) {
      await binding.send({
        from: { email: STUDIO_EMAIL, name: FROM_NAME },
        to: { email: STUDIO_EMAIL, name: "Botman Design Studio" },
        replyTo: { email: submission.email, name: submission.name },
        subject: email.subject,
        text: email.text,
        html: email.html,
      });
      return;
    }

    if (process.env.SMTP_HOST) {
      await sendOverSmtp(submission, email);
      return;
    }

    throw new Error("Email service is not configured.");
  }
}

/** De binding bestaat alleen op Cloudflare; elders faalt het ophalen ervan. */
async function cloudflareEmailBinding() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    return env.EMAIL ?? null;
  } catch {
    return null;
  }
}

async function sendOverSmtp(submission: ContactFormSubmission, email: ComposedEmail): Promise<void> {
  const { createTransport } = await import("nodemailer");

  const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });

  await transport.sendMail({
    from: { address: process.env.SMTP_FROM ?? STUDIO_EMAIL, name: FROM_NAME },
    to: process.env.CONTACT_RECIPIENT ?? STUDIO_EMAIL,
    replyTo: { address: submission.email, name: submission.name },
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
}

function compose(submission: ContactFormSubmission): ComposedEmail {
  const inquiryLabel = InquiryTypeLabel.forValue(submission.inquiryType);

  const subject = `New inquiry: ${inquiryLabel} — ${submission.name}`;

  const text = [
    "New contact form submission",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Inquiry type: ${inquiryLabel}`,
    "",
    "Message:",
    submission.message,
  ].join("\n");

  const html = `
      <div style="font-family: Georgia, serif; color: #675C53; line-height: 1.6;">
        <h2 style="font-weight: 400; letter-spacing: 0.06em; text-transform: uppercase; color: #675C53;">
          New contact form submission
        </h2>
        <p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>
        <p><strong>Inquiry type:</strong> ${escapeHtml(inquiryLabel)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(submission.message)}</p>
      </div>
    `.trim();

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
