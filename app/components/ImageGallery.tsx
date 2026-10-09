"use client";

import Image from "next/image";

type BlockItem = {
  id: number;
  type: "image" | "text";
  url?: string;
  alt?: string;
  title?: string;
  content?: string;
  className: string;
  bgColor?: string;
};

export default function ImageGallery() {
  // Cleaner, more organized layout
  const blocks: BlockItem[] = [
    {
      id: 1,
      type: "text",
      title: "Bas Botman",
      content: "Met een passie voor luxe interieurontwerp en architectuur, creëer ik ruimtes die tijdloos zijn en perfect aansluiten bij de visie van mijn klanten.",
      className: "md:row-span-2",
      bgColor: "var(--color-cedar)"
    },
    {
      id: 2,
      type: "image",
      url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
      alt: "Interior Design",
      className: "md:row-span-2"
    },
    {
      id: 3,
      type: "image",
      url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      alt: "Architectural Detail",
      className: ""
    },
    {
      id: 4,
      type: "text",
      title: "",
      content: "Van concept tot realisatie, ik begeleid elk project met aandacht voor detail en oog voor perfectie. Mijn ontwerpen combineren moderne esthetiek met klassieke elementen.",
      className: "",
      bgColor: "var(--color-almond)"
    },
    {
      id: 5,
      type: "image",
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      alt: "Contemporary Architecture",
      className: ""
    },
    {
      id: 6,
      type: "text",
      title: "",
      content: "Luxury interior design gaat verder dan alleen esthetiek. Het gaat om het creëren van een omgeving die inspireert, ontspant en weerspiegelt wie je bent.",
      className: "md:col-span-2",
      bgColor: "var(--color-cedar)"
    },
    {
      id: 7,
      type: "image",
      url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
      alt: "Elegant Interior",
      className: "md:row-span-2"
    },
    {
      id: 8,
      type: "text",
      title: "",
      content: "Elk project begint met een gesprek. Ik luister naar jouw wensen, dromen en behoeften. Samen ontwikkelen we een concept dat perfect past bij jouw levensstijl.",
      className: "",
      bgColor: "var(--color-champagne)"
    },
    {
      id: 9,
      type: "image",
      url: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
      alt: "Modern Interior",
      className: ""
    }
  ];

  return (
    <section className="w-full pt-4 pb-16 relative overflow-hidden">
      {/* Glowing gradient background - dark at top, lighter at bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, 
              #020203 0%,
              #020203 20%,
              rgba(2, 2, 3, 0.95) 30%,
              rgba(103, 92, 83, 0.3) 50%,
              rgba(182, 163, 144, 0.2) 70%,
              rgba(238, 227, 211, 0.15) 85%,
              rgba(247, 244, 241, 0.1) 100%
            )
          `
        }}
      />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[350px]">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`relative overflow-hidden rounded-lg ${block.className} ${
                block.type === "image" ? "group cursor-pointer" : ""
              }`}
              style={{
                backgroundColor: block.type === "image" ? "transparent" : (block.bgColor || "var(--color-cedar)"),
                border: "1px solid rgba(182, 163, 144, 0.4)"
              }}
            >
              {block.type === "image" ? (
                <>
                  <Image
                    src={block.url!}
                    alt={block.alt!}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg opacity-90"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg" />
                </>
              ) : (
                <div 
                  className="h-full p-8 md:p-10 flex flex-col justify-center"
                >
                  {block.title && (
                    <h2
                      className="text-3xl md:text-4xl font-light mb-6 uppercase tracking-wider"
                      style={{
                        fontFamily: 'var(--font-cormorant-garamond), serif',
                        letterSpacing: '0.15em',
                        color: block.bgColor === "var(--color-cedar)" || block.bgColor === "var(--color-almond)" ? "var(--color-champagne)" : "var(--color-cedar)"
                      }}
                    >
                      {block.title}
                    </h2>
                  )}
                  {block.content && (
                    <p
                      className="text-lg md:text-xl leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-cormorant-garamond), serif',
                        color: block.bgColor === "var(--color-cedar)" || block.bgColor === "var(--color-almond)" ? "var(--color-champagne)" : "var(--color-cedar)"
                      }}
                    >
                      {block.content}
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

