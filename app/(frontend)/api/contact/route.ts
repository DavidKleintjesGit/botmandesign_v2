import {
  ContactFormSubmission,
  ContactSubmissionResult,
} from "@/app/domain/contact/ContactFormSubmission";
import { ContactEmailSender } from "@/app/lib/contact/sendContactEmail";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return ContactSubmissionResult.failure("Invalid request body.").toResponse(400);
  }

  const submission = ContactFormSubmission.fromRequestBody(body);

  if (!submission) {
    return ContactSubmissionResult.failure("Please complete all fields with valid information.").toResponse(400);
  }

  try {
    await ContactEmailSender.send(submission);
    return ContactSubmissionResult.success("Your message has been sent.").toResponse(200);
  } catch (error) {
    console.error("Contact form email failed:", error);
    return ContactSubmissionResult.failure(
      "We could not send your message right now. Please try again or email studio@botmandesign.com directly.",
    ).toResponse(500);
  }
}
