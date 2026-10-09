"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface LoadingPageProps {
  show?: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
  timeWait?: number;
}

export default function LoadingPage({ 
  show = true, 
  fadeIn = true, 
  fadeOut = true, 
  timeWait = 2 
}: LoadingPageProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [opacity, setOpacity] = useState(fadeIn ? 0 : 1);

  useEffect(() => {
    if (!show) {
      if (fadeOut) {
        setOpacity(0);
        setTimeout(() => {
          setIsVisible(false);
        }, 800);
      } else {
        setIsVisible(false);
        setOpacity(0);
      }
      return;
    }

    // Reset and start the cycle
    setIsVisible(true);
    setOpacity(fadeIn ? 0 : 1);

    let fadeInTimer: NodeJS.Timeout | null = null;
    let waitTimer: NodeJS.Timeout | null = null;
    let hideTimer: NodeJS.Timeout | null = null;

    // Fade in if enabled
    if (fadeIn) {
      fadeInTimer = setTimeout(() => {
        setOpacity(1);
      }, 50);
    }

    // Calculate wait time
    const fadeInDelay = fadeIn ? 50 : 0;
    const waitTime = timeWait * 1000; // Convert seconds to milliseconds

    // Wait at full opacity, then fade out
    waitTimer = setTimeout(() => {
      if (fadeOut) {
        setOpacity(0);
        hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 800);
      } else {
        setIsVisible(false);
      }
    }, fadeInDelay + waitTime);

    return () => {
      if (fadeInTimer) clearTimeout(fadeInTimer);
      if (waitTimer) clearTimeout(waitTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [show, fadeIn, fadeOut, timeWait]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
      style={{ 
        opacity: opacity,
        transition: "opacity 0.8s ease-in-out",
        backgroundColor: "var(--color-cedar)"
      }}
    >
      {/* Pattern layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("/images/Botman Design Logo-20.svg")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          backgroundPosition: "0 0",
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("/images/Botman Design Logo-20.svg")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          backgroundPosition: "100px 100px",
          opacity: 0.3,
        }}
      />
      
      {/* Loading logo - positioned before overlay so it can be covered, hidden on mobile */}
      <div
        className="absolute inset-0 hidden md:flex items-center justify-center"
        style={{ zIndex: 10 }}
      >
        {/* Background label behind logo with centered content */}
        <div
          className="flex items-center justify-center relative"
          style={{
            width: "650px",
            height: "240px",
            backgroundColor: "var(--color-cedar)",
            borderRadius: "12px",
            border: "1px solid rgba(182, 163, 144, 0.4)",
            padding: "0 40px",
            zIndex: 9
          }}
        >
          <div className="relative" style={{ width: "570px", height: "190px", zIndex: 10 }}>
            <Image
              src="/images/Botman Design Logo-03-A.png"
              alt="Botman Design Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Moving fade overlay - covers both pattern and text */}
      <div
        style={{
          position: "absolute",
          top: "-100%",
          left: "-100%",
          width: "300%",
          height: "300%",
          background: "radial-gradient(ellipse 35% 20% at center, transparent 0%, transparent 15%, rgba(103, 92, 83, 0.2) 25%, rgba(103, 92, 83, 0.5) 40%, rgba(103, 92, 83, 0.8) 55%, rgba(103, 92, 83, 0.95) 70%, var(--color-cedar) 100%)",
          animation: "fade-diagonal 4s linear infinite",
          transformOrigin: "center center",
          zIndex: 11
        }}
      />
    </div>
  );
}

