"use client";

import { useEffect, useState } from "react";

export default function ContactFormSuccessIllustration() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="mx-auto flex max-w-md flex-col items-center text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 900ms ease, transform 900ms ease",
      }}
    >
      <div
        className="relative mb-8 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32"
        aria-hidden
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(238, 227, 211, 0.18) 0%, rgba(238, 227, 211, 0.04) 68%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-3 rounded-full border sm:inset-4"
          style={{ borderColor: "rgba(238, 227, 211, 0.22)" }}
        />
        <svg
          viewBox="0 0 96 96"
          className="relative h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="48"
            cy="48"
            r="34"
            stroke="var(--color-champagne)"
            strokeWidth="1.2"
            opacity="0.55"
          />
          <path
            d="M30 49.5L42.5 62L66 38.5"
            stroke="var(--color-champagne)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M48 18V10M48 86V78M18 48H10M86 48H78M26.1 26.1L20.4 20.4M75.6 75.6L69.9 69.9M26.1 69.9L20.4 75.6M75.6 20.4L69.9 26.1"
            stroke="var(--color-almond)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      </div>

      <h3
        className="text-2xl font-light uppercase tracking-[0.08em] md:text-3xl"
        style={{
          fontFamily: "var(--font-cormorant-garamond), serif",
          color: "var(--color-champagne)",
        }}
      >
        Message sent
      </h3>

      <p
        className="mt-4 max-w-sm text-sm leading-relaxed md:text-base"
        style={{
          fontFamily: "var(--font-montserrat)",
          color: "var(--color-almond)",
        }}
      >
        Thank you for reaching out. Your inquiry has been received and we will be in touch shortly.
      </p>
    </div>
  );
}
