"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type GalleryItem = {
  id: number;
  type: "image" | "text";
  url?: string;
  alt?: string;
  title?: string;
  content?: string;
  bgColor?: string;
};

export default function HorizontalImageGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const items: GalleryItem[] = [
    {
      id: 1,
      type: "text",
      title: "Bas Botman",
      content: "Met een passie voor luxe interieurontwerp en architectuur, creëer ik ruimtes die tijdloos zijn en perfect aansluiten bij de visie van mijn klanten.",
      bgColor: "var(--color-cedar)"
    },
    {
      id: 2,
      type: "image",
      url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
      alt: "Interior Design"
    },
    {
      id: 3,
      type: "text",
      title: "",
      content: "Van concept tot realisatie, ik begeleid elk project met aandacht voor detail en oog voor perfectie.",
      bgColor: "var(--color-almond)"
    },
    {
      id: 4,
      type: "image",
      url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      alt: "Architectural Detail"
    },
    {
      id: 5,
      type: "text",
      title: "",
      content: "Luxury interior design gaat verder dan alleen esthetiek. Het gaat om het creëren van een omgeving die inspireert.",
      bgColor: "var(--color-champagne)"
    },
    {
      id: 6,
      type: "image",
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      alt: "Contemporary Architecture"
    },
    {
      id: 7,
      type: "text",
      title: "",
      content: "Elk project begint met een gesprek. Ik luister naar jouw wensen, dromen en behoeften.",
      bgColor: "var(--color-cedar)"
    },
    {
      id: 8,
      type: "image",
      url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
      alt: "Elegant Interior"
    },
    {
      id: 9,
      type: "text",
      title: "",
      content: "Architecturale excellentie betekent voor mij het vinden van de perfecte balans tussen vorm en functie.",
      bgColor: "var(--color-almond)"
    },
    {
      id: 10,
      type: "image",
      url: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
      alt: "Modern Interior"
    },
    {
      id: 11,
      type: "text",
      title: "",
      content: "Met jarenlange ervaring in zowel residentiële als commerciële projecten, breng ik visie tot leven.",
      bgColor: "var(--color-cedar)"
    },
    {
      id: 12,
      type: "image",
      url: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80",
      alt: "Luxury Design"
    },
    {
      id: 13,
      type: "text",
      title: "",
      content: "Samen ontwikkelen we een concept dat perfect past bij jouw levensstijl en ruimte.",
      bgColor: "var(--color-champagne)"
    },
    {
      id: 14,
      type: "image",
      url: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
      alt: "Elegant Space"
    },
    {
      id: 15,
      type: "text",
      title: "",
      content: "Van eerste schets tot laatste accessoire, ik zorg voor een naadloze ervaring.",
      bgColor: "var(--color-almond)"
    },
    {
      id: 16,
      type: "image",
      url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      alt: "Design Excellence"
    },
    {
      id: 17,
      type: "text",
      title: "",
      content: "Ik werk met de beste materialen en ambachtslieden om ruimtes te creëren die niet alleen mooi zijn, maar ook duurzaam.",
      bgColor: "var(--color-cedar)"
    },
    {
      id: 18,
      type: "image",
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      alt: "Timeless Design"
    }
  ];

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current || !itemsRef.current) return;

    const section = sectionRef.current;
    const container = containerRef.current;
    const items = itemsRef.current;

    const updateAnimation = () => {
      // Calculate total width needed
      const itemWidth = 500;
      const gap = 32;
      const viewportWidth = window.innerWidth;
      const itemsWidth = items.children.length * (itemWidth + gap) - gap;
      
      // Calculate how far we can scroll while keeping blocks visible
      // We want to show all blocks but keep at least 1.5 blocks visible at the end
      const visibleBlocksAtEnd = 1.5; // Keep 1.5 blocks visible at the end
      const blockWidth = itemWidth + gap;
      // Calculate max scroll: scroll until last 1.5 blocks are still visible
      // This means we scroll: itemsWidth - viewportWidth - (1.5 * blockWidth)
      const maxScroll = Math.max(0, itemsWidth - viewportWidth - (visibleBlocksAtEnd * blockWidth));
      
      // Add extra space to container for smooth ending, but don't scroll into it
      const extraSpace = viewportWidth * 0.5;
      const totalWidth = itemsWidth + extraSpace;

      // Set container width
      gsap.set(items, { width: totalWidth });

      // Create horizontal scroll animation
      // Scroll distance should match the maxScroll we calculated
      const scrollDistance = 3000; // Scroll distance in pixels

      // Kill existing ScrollTrigger if any
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1, // Smooth scrubbing
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            // Keep the final position when scrolling past - maintain visibility
            gsap.set(items, { x: -maxScroll, clearProps: "none" });
          },
          onEnterBack: () => {
            // When scrolling back, maintain current position
            const currentX = gsap.getProperty(items, "x") as number;
            if (currentX === -maxScroll) {
              // If at end, keep it there
              gsap.set(items, { x: -maxScroll });
            }
          }
        }
      });
      
      tl.to(items, {
        x: -maxScroll,
        ease: "none",
        duration: 1
      });
      
      // Set initial position
      gsap.set(items, { x: 0 });
    };

    // Initial setup
    updateAnimation();

    // Update on resize
    window.addEventListener("resize", updateAnimation);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateAnimation);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{ 
        backgroundColor: "var(--color-black)",
        minHeight: "100vh"
      }}
    >
      {/* Gradient background - dark at top, fades to CEDAR at bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, 
              #020203 0%,
              #020203 20%,
              rgba(2, 2, 3, 0.95) 30%,
              rgba(103, 92, 83, 0.3) 50%,
              rgba(103, 92, 83, 0.5) 70%,
              rgba(103, 92, 83, 0.8) 85%,
              var(--color-cedar) 100%
            )
          `
        }}
      />

      {/* Horizontal scrolling container */}
      <div 
        ref={containerRef}
        className="h-screen flex items-center overflow-hidden"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div 
          ref={itemsRef}
          className="flex gap-8 px-8"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[500px] h-[600px] rounded-lg overflow-hidden"
              style={{
                backgroundColor: item.type === "image" ? "transparent" : (item.bgColor || "var(--color-cedar)"),
                border: "1px solid rgba(182, 163, 144, 0.4)"
              }}
            >
              {item.type === "image" ? (
                <div className="relative w-full h-full group cursor-pointer">
                  <Image
                    src={item.url!}
                    alt={item.alt!}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg opacity-90"
                    sizes="500px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg" />
                </div>
              ) : (
                <div 
                  className="h-full p-10 flex flex-col justify-center"
                >
                  {item.title && (
                    <h2
                      className="text-3xl md:text-4xl font-light mb-6 uppercase tracking-wider"
                      style={{
                        fontFamily: 'var(--font-cormorant-garamond), serif',
                        letterSpacing: '0.15em',
                        color: item.bgColor === "var(--color-cedar)" || item.bgColor === "var(--color-almond)" ? "var(--color-champagne)" : "var(--color-cedar)"
                      }}
                    >
                      {item.title}
                    </h2>
                  )}
                  {item.content && (
                    <p
                      className="text-lg md:text-xl leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-cormorant-garamond), serif',
                        color: item.bgColor === "var(--color-cedar)" || item.bgColor === "var(--color-almond)" ? "var(--color-champagne)" : "var(--color-cedar)"
                      }}
                    >
                      {item.content}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
