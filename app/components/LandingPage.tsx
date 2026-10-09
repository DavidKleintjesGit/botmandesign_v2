"use client";

import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import SocialMediaLabel from "./SocialMediaLabel";
import LanguageLabel from "./LanguageLabel";
import LoadingPage from "./LoadingPage";
import CookiePopup from "./CookiePopup";
import BusinessCardComponent from "./BusinessCardComponent";
import HorizontalImageGalleryPlaceholder from "./HorizontalImageGalleryPlaceholder";
import ServicesSection from "./ServicesSection";
import AboutSection from "./AboutSection";
import TestimonialSection from "./TestimonialSection";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingPage() {
  const headerTriggerRef = useRef<HTMLDivElement>(null);
  const galleryPlaceholderRef = useRef<HTMLDivElement>(null);
  const hideCardAfterRef = useRef<HTMLDivElement>(null);
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const [showLanguageLoading, setShowLanguageLoading] = useState(false);
  const [loadingKey, setLoadingKey] = useState(0);

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    setTimeout(scrollToTop, 100);
    setTimeout(scrollToTop, 500);

    const timer = setTimeout(() => {
      setShowInitialLoading(false);
      scrollToTop();
    }, 3300);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = () => {
    setShowLanguageLoading(true);
    setLoadingKey((prev) => prev + 1);
    setTimeout(() => {
      setShowLanguageLoading(false);
    }, 3850);
  };

  return (
    <div className="font-sans" style={{ backgroundColor: "var(--color-mist)" }}>
      <LoadingPage
        key={loadingKey}
        show={showInitialLoading || showLanguageLoading}
        fadeIn={!showInitialLoading}
        fadeOut
        timeWait={showInitialLoading ? 2.5 : 3}
      />
      <Navbar headerTriggerRef={headerTriggerRef} />
      <BusinessCardComponent showCardAfterRef={headerTriggerRef} hideCardAfterRef={hideCardAfterRef} />
      <SocialMediaLabel />
      <LanguageLabel onLanguageChange={handleLanguageChange} />
      <div ref={headerTriggerRef}>
        <Header />
      </div>
      <div ref={galleryPlaceholderRef}>
        <HorizontalImageGalleryPlaceholder />
      </div>
      <ServicesSection />
      <AboutSection />
      <TestimonialSection />
      <div ref={hideCardAfterRef}>
        <CTA />
      </div>
      <Footer />
      <CookiePopup />
    </div>
  );
}
