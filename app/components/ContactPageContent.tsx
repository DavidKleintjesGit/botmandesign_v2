"use client";

import { useState } from "react";
import Image from "next/image";

import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import { useLanguage } from "./LanguageProvider";

const contactCopy = {
  en: {
    label: "CONTACT",
    heroLine1: "Every interior",
    heroLine2: "begins with",
    heroLine3: "a conversation.",
    panelTitle: "A great interior starts with a great conversation.",
    panelBody:
      "Send us a short message — we'll get back to you within 1–2 business days to find a moment that works for both of us.",
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
  },
  nl: {
    label: "CONTACT",
    heroLine1: "Elk interieur",
    heroLine2: "begint met",
    heroLine3: "een gesprek.",
    panelTitle: "Een goed interieur begint met een goed gesprek.",
    panelBody:
      "Stuur ons een kort bericht — we nemen binnen 1–2 werkdagen contact op om samen een moment te vinden.",
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
  },
};

const INQUIRY_OPTIONS = [
  { value: "turn-key-projects", label: "Turn-key Projects" },
  { value: "interior-upgrade", label: "Interior Upgrade" },
  { value: "restyling", label: "Restyling" },
  { value: "b2b-partnerships", label: "B2B Partnerships" },
  { value: "other", label: "Overig" },
];

const serif = { fontFamily: "var(--font-cormorant-garamond), serif" } as const;
const sans = { fontFamily: "var(--font-montserrat)" } as const;

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactPageContent() {
  const { language } = useLanguage();
  const copy = contactCopy[language];

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
    <div style={{ backgroundColor: "var(--color-cedar)" }}>
      <SiteHeader />

      {/* HERO */}
      <header className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/design/contact-hero.jpg"
          alt="Interieur door Botman Design"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-64"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0))" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-96"
          style={{
            background:
              "linear-gradient(to top, var(--color-cedar) 0%, rgba(103, 92, 83, 0.9) 30%, rgba(103, 92, 83, 0.5) 60%, rgba(103, 92, 83, 0) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 z-30 pb-20 md:pb-28">
          <div className="container mx-auto px-4 text-center md:px-8">
            <p
              className="mb-6 text-sm uppercase md:text-base"
              style={{ ...sans, color: "var(--color-champagne)" }}
            >
              {copy.label}
            </p>
            <h1
              className="text-4xl font-light uppercase tracking-wider md:text-5xl"
              style={{ ...serif, letterSpacing: "0.15em", color: "var(--color-champagne)" }}
            >
              {copy.heroLine1}
              <br />
              {copy.heroLine2}
              <br />
              <span style={{ color: "var(--color-almond)" }}>{copy.heroLine3}</span>
            </h1>
          </div>
        </div>
      </header>

      {/* FORMULIER */}
      <section id="form" className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-14 md:flex-row md:gap-20">
            <div className="md:w-2/5">
              <h2
                className="mb-8 text-2xl font-light uppercase tracking-wider md:text-3xl"
                style={{ ...serif, letterSpacing: "0.1em", color: "var(--color-champagne)" }}
              >
                {copy.panelTitle}
              </h2>

              <p
                className="text-lg leading-relaxed md:text-xl"
                style={{ ...serif, color: "var(--color-almond)" }}
              >
                {copy.panelBody}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:w-3/5">
              <label className="flex flex-col gap-3 text-[11px] uppercase md:text-xs" style={labelTextStyle}>
                {copy.formName}
                <input type="text" name="name" style={fieldStyle} />
              </label>

              <label className="flex flex-col gap-3 text-[11px] uppercase md:text-xs" style={labelTextStyle}>
                {copy.formEmail}
                <input type="email" name="email" style={fieldStyle} />
              </label>

              <label className="flex flex-col gap-3 text-[11px] uppercase md:text-xs" style={labelTextStyle}>
                {copy.formInquiry}
                <select name="inquiryType" defaultValue="" style={fieldStyle}>
                  <option value="" disabled style={{ color: "var(--color-cedar)" }}>
                    {copy.choose}
                  </option>
                  {INQUIRY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} style={{ color: "var(--color-cedar)" }}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-3 text-[11px] uppercase md:text-xs" style={labelTextStyle}>
                {copy.formMessage}
                <textarea
                  name="message"
                  rows={5}
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
