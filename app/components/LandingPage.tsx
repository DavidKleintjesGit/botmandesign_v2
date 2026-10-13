"use client";

import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import LoadingPage from "./LoadingPage";
import BusinessCardComponent from "./BusinessCardComponent";
import HorizontalImageGalleryPlaceholder from "./HorizontalImageGalleryPlaceholder";
import HomeProjectsSection from "./HomeProjectsSection";
import ServicesSection from "./ServicesSection";
import AboutSection from "./AboutSection";
import TestimonialSection from "./TestimonialSection";
import CTA from "./CTA";
import { useLanguage } from "./LanguageProvider";
import Footer from "./Footer";

import type { Project } from "@/app/content/projects";
import type { Service } from "@/app/content/services";
import type { Testimonial } from "@/app/content/testimonials";

interface LandingPageProps {
  projects: Project[];
  services: Record<string, Service>;
  testimonials: Testimonial[];
}

export default function LandingPage({ projects, services, testimonials }: LandingPageProps) {
  const headerTriggerRef = useRef<HTMLDivElement>(null);
  const galleryPlaceholderRef = useRef<HTMLDivElement>(null);
  const hideCardAfterRef = useRef<HTMLDivElement>(null);
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const [showLanguageLoading, setShowLanguageLoading] = useState(false);
  const [loadingKey, setLoadingKey] = useState(0);
  const { language } = useLanguage();

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

  const eersteTaal = useRef(language);

  useEffect(() => {
    // Alleen bij een wissel, niet bij het eerste bezoek.
    if (eersteTaal.current === language) return;
    eersteTaal.current = language;

    setShowLanguageLoading(true);
    setLoadingKey((prev) => prev + 1);

    const timer = setTimeout(() => setShowLanguageLoading(false), 3850);
    return () => clearTimeout(timer);
  }, [language]);

  return (
    <div className="font-sans" style={{ backgroundColor: "var(--color-mist)" }}>
      <LoadingPage
        key={loadingKey}
        show={showInitialLoading || showLanguageLoading}
        fadeIn={!showInitialLoading}
        fadeOut
        timeWait={showInitialLoading ? 2.5 : 3}
      />
      <BusinessCardComponent showCardAfterRef={headerTriggerRef} hideCardAfterRef={hideCardAfterRef} />
      <div ref={headerTriggerRef}>
        <Header />
      </div>
      <div ref={galleryPlaceholderRef}>
        <HorizontalImageGalleryPlaceholder />
      </div>
      <HomeProjectsSection projects={projects} />
      <ServicesSection services={services} />
      <AboutSection />
      <TestimonialSection testimonials={testimonials} />
      <div ref={hideCardAfterRef}>
        <CTA />
      </div>
      <Footer />
      {/* De cookiemelding staat tijdelijk uit; zet hem terug voor de site live gaat. */}
    </div>
  );
}
