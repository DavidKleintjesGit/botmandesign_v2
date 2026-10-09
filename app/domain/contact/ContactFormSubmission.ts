export type ContactFormSubmissionInput = {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
};

export class ContactFormSubmission {
  readonly name: string;
  readonly email: string;
  readonly inquiryType: string;
  readonly message: string;

  private constructor(input: ContactFormSubmissionInput) {
    this.name = input.name;
    this.email = input.email;
    this.inquiryType = input.inquiryType;
    this.message = input.message;
  }

  static fromInput(input: ContactFormSubmissionInput): ContactFormSubmission {
    return new ContactFormSubmission(input);
  }

  static fromRequestBody(body: unknown): ContactFormSubmission | null {
    if (!body || typeof body !== "object") {
      return null;
    }

    const record = body as Record<string, unknown>;
    const name = ContactFormSubmission.normalizeText(record.name, 120);
    const email = ContactFormSubmission.normalizeText(record.email, 254);
    const inquiryType = ContactFormSubmission.normalizeText(record.inquiryType, 64);
    const message = ContactFormSubmission.normalizeText(record.message, 4000);

    if (!name || !email || !inquiryType || !message) {
      return null;
    }

    if (!ContactFormSubmission.isValidEmail(email)) {
      return null;
    }

    return ContactFormSubmission.fromInput({ name, email, inquiryType, message });
  }

  private static normalizeText(value: unknown, maxLength: number): string {
    if (typeof value !== "string") {
      return "";
    }

    return value.trim().slice(0, maxLength);
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

export class ContactSubmissionResult {
  readonly success: boolean;
  readonly message: string;

  private constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }

  static success(message: string): ContactSubmissionResult {
    return new ContactSubmissionResult(true, message);
  }

  static failure(message: string): ContactSubmissionResult {
    return new ContactSubmissionResult(false, message);
  }

  toResponse(status: number): Response {
    return Response.json(
      {
        success: this.success,
        message: this.message,
      },
      { status },
    );
  }
}
