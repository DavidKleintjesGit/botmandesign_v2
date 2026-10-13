"use client";

import { useState } from "react";

import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";
import type { Service } from "@/app/content/services";

const contactCopy = {
  en: {
    label: "CONTACT",
    title: "Every interior begins",
    titleAccent: "with a conversation.",
    intro:
      "Send us a short message — we'll get back to you within 1–2 business days to find a moment that works for both of us.",
    directLabel: "OR REACH US DIRECTLY",
    formName: "Name",
    formEmail: "Email",
    formInquiry: "Subject",
    formMessage: "Message",
    formSend: "Send",
    sending: "Sending",
    success: "Thank you — your message has been sent.",
    required: "Please complete all fields.",
    failed: "We could not send your message. Please try again later or email us directly.",
    choose: "Choose a subject",
    other: "Something else",
  },
  nl: {
    label: "CONTACT",
    title: "Elk interieur begint",
    titleAccent: "met een gesprek.",
    intro:
      "Stuur ons een kort bericht — we nemen binnen 1–2 werkdagen contact op om samen een moment te vinden.",
    directLabel: "OF NEEM DIRECT CONTACT OP",
    formName: "Naam",
    formEmail: "E-mail",
    formInquiry: "Onderwerp",
    formMessage: "Bericht",
    formSend: "Versturen",
    sending: "Versturen",
    success: "Dank u — uw bericht is verstuurd.",
    required: "Vul alle velden in.",
    failed: "Versturen is niet gelukt. Probeer het later opnieuw of mail ons direct.",
    choose: "Kies een onderwerp",
    other: "Iets anders",
  },
};

const DIRECT = [
  { label: "studio@botmandesign.com", href: "mailto:studio@botmandesign.com" },
  { label: "+31 6 12 34 56 78", href: "tel:+31612345678" },
];

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

type Status = "idle" | "sending" | "sent" | "error";

/*
 * De contactpagina is een formulier, verder niets.
 *
 * Er stond een beeldvullende foto boven, maar die vroeg hier alleen aandacht:
 * wie hier komt wil iets opsturen, niet nog een interieur bekijken. De pagina
 * houdt daarom dezelfde kop als de andere onderliggende pagina's en gaat
 * daarna meteen over in het formulier.
 */
export default function ContactPageContent({ services }: { services: Record<string, Service> }) {
  const { language } = useLanguage();
  const copy = contactCopy[language];

  /*
   * De onderwerpen zijn de diensten zoals ze in het beheer staan, niet een
   * eigen lijstje hier: voegt Bas een dienst toe of hernoemt hij er een, dan
   * staat die meteen ook in dit formulier.
   *
   * Wat verstuurd wordt is de naam en niet de slug, zodat in de mail "Turn-key
   * Projects" staat en niet "turn-key-projects".
   */
  const subjects = Object.values(services).map((service) => service[language].name);

  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      inquiryType: String(data.get("inquiryType") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    if (!payload.name || !payload.email || !payload.inquiryType || !payload.message) {
      setStatus("error");
      setFeedback(copy.required);
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setFeedback(result.message ?? copy.failed);
        return;
      }

      setStatus("sent");
      setFeedback(copy.success);
      form.reset();
    } catch {
      setStatus("error");
      setFeedback(copy.failed);
    }
  }

  const fieldStyle = {
    ...serif,
    border: "none",
    borderBottom: "1px solid rgba(182, 163, 144, 0.45)",
    background: "transparent",
    padding: "10px 0",
    fontSize: "1.05rem",
    color: "var(--color-champagne)",
    outline: "none",
  } as const;

  const labelTextStyle = {
    ...sans,
    letterSpacing: "0.15em",
    color: "var(--color-almond)",
  } as const;

  return (
    <div>
      {/*
       * Alles onder elkaar op één lijn.
       *
       * Er stonden vier blokken die elk op een andere hoogte begonnen: de kop
       * links, de inleiding zwevend halverwege rechts, de gegevens links
       * daaronder en het formulier rechts. Je oog had vier plekken om te
       * beginnen, en dat is precies wat een pagina onrustig maakt. Nu is er één
       * linkermarge en lees je van boven naar beneden: wie we zijn, wat je
       * invult, hoe je ons anders bereikt.
       */}
      <section className="w-full pt-40 pb-16 md:pt-52 md:pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <p className="mb-6 text-sm uppercase md:text-base" style={{ ...sans, color: "var(--color-champagne)" }}>
            {copy.label}
          </p>

          <h1
            className="mb-10 text-3xl font-light uppercase tracking-wider md:text-4xl lg:text-5xl"
            style={{ ...serif, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
          >
            {copy.title}
            <br />
            <span style={{ color: "var(--color-almond)" }}>{copy.titleAccent}</span>
          </h1>

          <p
            className="max-w-xl text-lg leading-relaxed md:text-xl"
            style={{ ...serif, color: "var(--color-almond)" }}
          >
            {copy.intro}
          </p>
        </div>
      </section>

      <section id="form" className="w-full pb-24 md:pb-36">
        <div className="container mx-auto px-4 md:px-8">
          <div className="w-full max-w-3xl">

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
              <div className="grid gap-8 md:grid-cols-2">
                <label className="flex flex-col gap-3 text-[11px] uppercase md:text-xs" style={labelTextStyle}>
                  {copy.formName}
                  <input type="text" name="name" style={fieldStyle} />
                </label>

                <label className="flex flex-col gap-3 text-[11px] uppercase md:text-xs" style={labelTextStyle}>
                  {copy.formEmail}
                  <input type="email" name="email" style={fieldStyle} />
                </label>
              </div>

              <label className="flex flex-col gap-3 text-[11px] uppercase md:text-xs" style={labelTextStyle}>
                {copy.formInquiry}
                <select name="inquiryType" defaultValue="" style={fieldStyle}>
                  <option value="" disabled style={{ color: "var(--color-cedar)" }}>
                    {copy.choose}
                  </option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject} style={{ color: "var(--color-cedar)" }}>
                      {subject}
                    </option>
                  ))}
                  <option value={copy.other} style={{ color: "var(--color-cedar)" }}>
                    {copy.other}
                  </option>
                </select>
              </label>

              <label className="flex flex-col gap-3 text-[11px] uppercase md:text-xs" style={labelTextStyle}>
                {copy.formMessage}
                <textarea
                  name="message"
                  rows={6}
                  style={{ ...fieldStyle, resize: "vertical", fontFamily: "var(--font-cormorant-garamond), serif" }}
                />
              </label>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 inline-block cursor-pointer self-start rounded-full border px-6 py-2.5 text-sm font-light uppercase tracking-wider transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                style={{
                  ...sans,
                  letterSpacing: "0.15em",
                  backgroundColor: "var(--color-champagne)",
                  borderColor: "var(--color-champagne)",
                  color: "var(--color-cedar)",
                }}
              >
                {status === "sending" ? copy.sending : copy.formSend}
              </button>

              {feedback && (
                <p
                  className="text-base leading-relaxed"
                  style={{ ...serif, color: status === "sent" ? "var(--color-champagne)" : "#e0b4a4" }}
                  role="status"
                >
                  {feedback}
                </p>
              )}
            </form>

            {/* Voor wie liever geen formulier invult. Eén regel, onderaan. */}
            <div
              className="mt-20 flex flex-col gap-3 border-t pt-10 md:flex-row md:items-baseline md:gap-10"
              style={{ borderColor: "rgba(182, 163, 144, 0.25)" }}
            >
              <p className="text-[11px] uppercase md:text-xs" style={labelTextStyle}>
                {copy.directLabel}
              </p>

              <div className="flex flex-col gap-2 md:flex-row md:gap-8">
                {DIRECT.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="w-fit text-lg transition-opacity duration-300 hover:opacity-70 md:text-xl"
                    style={{ ...serif, color: "var(--color-champagne)" }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
