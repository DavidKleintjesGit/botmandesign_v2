"use client";

export default function Footer() {
  return (
    <footer
      className="w-full py-16 md:py-20"
      style={{
        backgroundColor: "var(--color-cedar)",
        borderTop: "1px solid rgba(182, 163, 144, 0.25)",
      }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand Section */}
          <div className="flex flex-col">
            <p className="t-tekst mb-6">
              &ldquo;Design is not decoration.
              <br />
              It is release.&rdquo;
            </p>
            <p className="t-tekst mb-4">
              Luxe interieurontwerp en architectuur voor tijdloze ruimtes die
              perfect aansluiten bij uw visie.
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col">
            <h4 className="t-titel mb-6">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:studio@botmandesign.com"
                className="t-label transition-colors hover:opacity-80"
              >
                studio@botmandesign.com
              </a>
              <a
                href="tel:+31612345678"
                className="t-label transition-colors hover:opacity-80"
              >
                +31 6 12 34 56 78
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col">
            <h4 className="t-titel mb-6">Links</h4>
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="t-label transition-colors hover:opacity-80"
              >
                B2B Partnerships
              </a>
              <a
                href="#"
                className="t-label transition-colors hover:opacity-80"
              >
                Press &amp; Features
              </a>
              <a
                href="#"
                className="t-label transition-colors hover:opacity-80"
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
            <p className="t-label">
              © 2024 – {new Date().getFullYear()} Botman Design. Alle rechten
              voorbehouden.
            </p>
            <a
              href="http://logicly.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="t-label transition-colors hover:opacity-80"
            >
              Made by Logicly
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
