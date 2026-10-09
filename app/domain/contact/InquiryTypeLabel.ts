/*
 * De waarden komen één op één uit de studio services (zie app/content/services.ts),
 * aangevuld met de aanvraagsoorten die geen service zijn.
 */
const INQUIRY_LABELS: Record<string, string> = {
  "style-consult": "Style Consult",
  "signature-ontwerp": "Signature Ontwerp",
  "home-couture": "Home Couture",
  "b2b-partnerships": "B2B Partnerships",
  other: "Overig",
};

export class InquiryTypeLabel {
  static forValue(value: string): string {
    return INQUIRY_LABELS[value] ?? value;
  }
}
