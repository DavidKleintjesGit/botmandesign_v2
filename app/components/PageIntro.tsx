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
  /*
   * Geen eigen achtergrond: die komt van body, zodat dit blok meeverloopt
   * wanneer je vanaf de collectie binnenkomt. Schilderde het zelf cedar, dan
   * stond de kop meteen in de nieuwe kleur terwijl de rest nog overging.
   */
  return (
    <section className="w-full pt-40 pb-16 md:pt-52 md:pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <p className="t-label t-label--sterk mb-6">{label}</p>

        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h1 className="t-kop max-w-3xl">
            {title}
            {titleAccent && (
              <>
                <br />
                <span style={{ color: "var(--ink-zacht)" }}>{titleAccent}</span>
              </>
            )}
          </h1>

          {intro && <p className="t-tekst max-w-md">{intro}</p>}
        </div>
      </div>
    </section>
  );
}
