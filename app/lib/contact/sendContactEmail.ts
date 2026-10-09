import { getCloudflareContext } from "@opennextjs/cloudflare";

import { ContactFormSubmission } from "@/app/domain/contact/ContactFormSubmission";
import { InquiryTypeLabel } from "@/app/domain/contact/InquiryTypeLabel";

const STUDIO_EMAIL = "studio@botmandesign.com";
const FROM_NAME = "Botman Design Website";

export class ContactEmailSender {
  static async send(submission: ContactFormSubmission): Promise<void> {
    const { env } = await getCloudflareContext({ async: true });
    const emailBinding = env.EMAIL;

    if (!emailBinding) {
      throw new Error("Email service is not configured.");
    }

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

    await emailBinding.send({
      from: { email: STUDIO_EMAIL, name: FROM_NAME },
      to: { email: STUDIO_EMAIL, name: "Botman Design Studio" },
      replyTo: { email: submission.email, name: submission.name },
      subject,
      text,
      html,
    });
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
