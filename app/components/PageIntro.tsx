"use client";

/*
 * De kop van een onderliggende pagina. Houdt dezelfde maatvoering aan als de
 * secties op de homepage: een klein Montserrat-label, daaronder een lichte
 * Cormorant-kop in hoofdletters met brede spatiëring.
 */
export default function PageIntro({
  label,
  title,
  titleAccent,
  intro,
}: {
  label: string;
  title: string;
  titleAccent?: string;
  intro?: string;
}) {
  return (
    <section className="w-full pt-40 pb-16 md:pt-52 md:pb-24" style={{ backgroundColor: "var(--color-cedar)" }}>
      <div className="container mx-auto px-4 md:px-8">
        <p
          className="mb-6 text-sm uppercase md:text-base"
          style={{ fontFamily: "var(--font-montserrat)", color: "var(--color-champagne)" }}
        >
          {label}
        </p>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h1
            className="max-w-3xl text-3xl font-light uppercase tracking-wider md:text-4xl lg:text-5xl"
            style={{
              fontFamily: "var(--font-cormorant-garamond), serif",
              letterSpacing: "0.15em",
              color: "var(--color-champagne)",
            }}
          >
            {title}
            {titleAccent && (
              <>
                <br />
                <span style={{ color: "var(--color-almond)" }}>{titleAccent}</span>
              </>
            )}
          </h1>

          {intro && (
            <p
              className="max-w-md text-lg leading-relaxed md:text-xl"
              style={{ fontFamily: "var(--font-cormorant-garamond), serif", color: "var(--color-almond)" }}
            >
              {intro}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
