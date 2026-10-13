"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "./LanguageProvider";
import { homeCopy } from "@/app/content/home";

export default function Header() {
  const { language } = useLanguage();
  const copy = homeCopy[language];
  const [videoReady, setVideoReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleVideoReady = () => {
    // Wait longer to ensure video is fully loaded, rendered, and playing
    // This ensures the first frame matches the image before we switch
    setTimeout(() => {
      setVideoReady(true);
    }, 3000);
  };

  return (
    <header
      className="w-full h-screen relative overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Video - loads immediately, stays hidden until ready */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "177.77777778vh",
            height: "100vh",
            minWidth: "100vw",
            minHeight: "56.25vw",
            transform: "translate(-50%, -50%)",
            opacity: videoReady ? 1 : 0,
            transition: "none",
          }}
        >
          <iframe
            ref={iframeRef}
            src="https://player.vimeo.com/video/530852504?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0&controls=0"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            onLoad={handleVideoReady}
            className="w-full h-full"
            style={{
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Image - stays on top until video is ready, then fades out */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: videoReady ? 0 : 1,
          transition: videoReady ? "opacity 0.2s" : "none",
          zIndex: videoReady ? 0 : 10,
        }}
      >
        <img
          src="https://images.squarespace-cdn.com/content/v1/5d8350f138e929025e59bf2d/1615050329798-D0RGZBP4OIQLCHYWMUQA/studioliv-interior-design-luxe-residentie-01.jpg"
          alt="Header background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlay at top for navbar visibility */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))",
        }}
      />

      {/* Gradient overlay at bottom - fades to black to connect with ImageGallery */}
      <div
        className="absolute bottom-0 left-0 right-0 h-96 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to top, #020203 0%, rgba(2, 2, 3, 0.9) 30%, rgba(2, 2, 3, 0.5) 60%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* Woordmerk met de hero-tekst uit Bas zijn ontwerp */}
      <div className="absolute bottom-16 left-1/2 z-30 flex w-full max-w-xl -translate-x-1/2 flex-col items-center gap-6 px-4 text-center">
        <Link
          href="/projecten"
          className="t-label t-label--sterk border-b pb-2 transition-opacity duration-300 hover:opacity-80"
          style={{
            fontFamily: "var(--font-montserrat)",
            letterSpacing: "0.15em",
            borderColor: "rgba(182, 163, 144, 0.5)",
            color: "var(--color-champagne)",
          }}
        >
          {copy.currentProjects} &rarr;
        </Link>

        <Image
          src="/images/Botman Design Logo-03-B.png"
          alt="Botman Design Logo"
          width={150}
          height={50}
          className="h-auto"
        />
      </div>
    </header>
  );
}
