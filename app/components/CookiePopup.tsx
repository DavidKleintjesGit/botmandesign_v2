"use client";

import { useState, useEffect } from "react";

export default function CookiePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already agreed
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show popup after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="backdrop-blur-md border-t shadow-2xl"
        style={{
          fontFamily: "var(--font-cormorant-garamond), serif",
          backgroundColor: "var(--color-cedar)",
          borderColor: "var(--color-almond)",
        }}
      >
        <div className="container mx-auto px-8 md:px-12 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-left">
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--color-champagne)",
                  fontFamily: "var(--font-cormorant-garamond), serif",
                }}
              >
                Wij gebruiken cookies om uw browse-ervaring te verbeteren en ons
                verkeer te analyseren.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDecline}
                className="uppercase text-xs font-semibold tracking-wider px-6 py-2 rounded transition-all duration-300 cursor-pointer whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-cormorant-garamond), serif",
                  letterSpacing: "0.15em",
                  color: "var(--color-champagne)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-almond)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Weigeren
              </button>
              <button
                onClick={handleAgree}
                className="uppercase text-xs font-semibold tracking-wider px-6 py-2 rounded transition-all duration-300 cursor-pointer whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-cormorant-garamond), serif",
                  letterSpacing: "0.15em",
                  color: "var(--color-black)",
                  backgroundColor: "var(--color-champagne)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-almond)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-champagne)")
                }
              >
                Accepteren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
