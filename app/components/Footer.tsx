"use client";

export default function Footer() {
  return (
    <footer 
      className="w-full py-16 md:py-20"
      style={{ 
        backgroundColor: "var(--color-cedar)",
        borderTop: "1px solid rgba(182, 163, 144, 0.25)"
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand Section */}
          <div className="flex flex-col">
            <p
              className="text-base md:text-lg font-light mb-6 leading-relaxed uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-cormorant-garamond), serif',
                letterSpacing: '0.15em',
                color: "var(--color-champagne)"
              }}
            >
              &ldquo;Design is not decoration.
              <br />
              It is release.&rdquo;
            </p>
            <p 
              className="text-base md:text-lg leading-relaxed mb-4"
              style={{
                fontFamily: 'var(--font-cormorant-garamond), serif',
                color: "var(--color-almond)"
              }}
            >
              Luxe interieurontwerp en architectuur voor tijdloze ruimtes die perfect aansluiten bij uw visie.
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col">
            <h4 
              className="text-lg md:text-xl font-light mb-6 uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-cormorant-garamond), serif',
                letterSpacing: '0.15em',
                color: "var(--color-champagne)"
              }}
            >
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a 
                href="mailto:studio@botmandesign.com"
                className="text-[11px] md:text-xs transition-colors hover:opacity-80"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  color: "var(--color-almond)"
                }}
              >
                studio@botmandesign.com
              </a>
              <a 
                href="tel:+31612345678"
                className="text-[11px] md:text-xs transition-colors hover:opacity-80"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  color: "var(--color-almond)"
                }}
              >
                +31 6 12 34 56 78
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col">
            <h4 
              className="text-lg md:text-xl font-light mb-6 uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-cormorant-garamond), serif',
                letterSpacing: '0.15em',
                color: "var(--color-champagne)"
              }}
            >
              Links
            </h4>
            <nav className="flex flex-col gap-3">
              <a 
                href="#"
                className="text-[11px] md:text-xs uppercase tracking-wider transition-colors hover:opacity-80"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.15em',
                  color: "var(--color-almond)"
                }}
              >
                B2B Partnerships
              </a>
              <a 
                href="#"
                className="text-[11px] md:text-xs uppercase tracking-wider transition-colors hover:opacity-80"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.15em',
                  color: "var(--color-almond)"
                }}
              >
                Press &amp; Features
              </a>
              <a 
                href="#"
                className="text-[11px] md:text-xs uppercase tracking-wider transition-colors hover:opacity-80"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.15em',
                  color: "var(--color-almond)"
                }}
              >
                Privacy / Voorwaarden
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="mt-12 pt-8 border-t"
          style={{ borderColor: "rgba(182, 163, 144, 0.2)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              className="text-xs md:text-sm"
              style={{
                fontFamily: 'var(--font-cormorant-garamond), serif',
                color: "var(--color-almond)"
              }}
            >
              © 2024 – {new Date().getFullYear()} Botman Design. Alle rechten voorbehouden.
            </p>
            <a
              href="http://logicly.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm transition-colors hover:opacity-80"
              style={{
                fontFamily: 'var(--font-cormorant-garamond), serif',
                color: "var(--color-almond)"
              }}
            >
              Made by Logicly
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


