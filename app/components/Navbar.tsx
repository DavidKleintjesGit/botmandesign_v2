"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  headerTriggerRef?: React.RefObject<HTMLElement | null>;
}

export default function Navbar({ headerTriggerRef }: NavbarProps) {
  const leftLinksRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = headerTriggerRef?.current;
    if (!trigger || !leftLinksRef.current || !logoRef.current || !rightRef.current) return;

    const fadeOut = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "bottom top+=300",
        toggleActions: "play none none reverse",
      },
    });

    fadeOut
      .to(leftLinksRef.current, { opacity: 0, duration: 0.2 }, 0)
      .to(logoRef.current, { opacity: 0, duration: 0.2 }, 0)
      .to(rightRef.current, { opacity: 0, duration: 0.2 }, 0);

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === trigger) t.kill();
      });
    };
  }, [headerTriggerRef]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent pt-5">
      <div className="container mx-auto px-8 md:px-12">
        <div className="flex items-center justify-between relative min-h-[110px]">
          <div ref={leftLinksRef} className="flex items-center gap-8 -mt-3">
            <Link href="/projecten" className="text-white uppercase text-sm font-light tracking-wider transition-colors" style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.15em' }}>
              Portfolio
            </Link>
            <Link href="/services" className="text-white uppercase text-sm font-light tracking-wider transition-colors" style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.15em' }}>
              Services
            </Link>
          </div>
          <div ref={logoRef} className="absolute left-1/2 top-6" style={{ transform: 'translateX(-50%)' }}>
            <Image
              src="/images/Botman Design Logo-03-A.png"
              alt="Botman Design Logo"
              width={240}
              height={80}
              className="h-auto"
            />
          </div>
          <div ref={rightRef} className="flex items-center gap-8 -mt-3">
            <Link href="/" className="text-white uppercase text-sm font-light tracking-wider transition-colors" style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.15em' }}>
              Over Bas
            </Link>
            <Link
              href="/contact"
              className="inline-block px-5 py-2.5 rounded-full border backdrop-blur-md uppercase text-sm font-light tracking-wider transition-all duration-300 hover:opacity-90"
              style={{
                fontFamily: 'var(--font-montserrat)',
                letterSpacing: '0.15em',
                backgroundColor: 'transparent',
                borderColor: 'var(--color-almond)',
                color: 'var(--color-champagne)',
              }}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
