"use client";

import { useField } from "@payloadcms/ui";

import "./slidelayout.scss";

/*
 * De keuze van een dia-vorm, als tekeningetjes in plaats van een keuzelijst.
 *
 * "Twee beelden, versprongen" zegt pas iets als je het een keer hebt gezien.
 * Met een lijstje moet je de site ernaast openen om te weten wat je kiest; met
 * een plattegrondje van de indeling zie je het meteen.
 *
 * De tekeningen zijn geen voorbeeld van de foto's maar van de verdeling: waar
 * beeld staat en waar tekst. Dat is wat je hier kiest.
 */

type Vorm = {
  waarde: string;
  naam: string;
  uitleg: string;
  tekening: React.ReactNode;
};

/* Een vlak in de tekening: beeld is gevuld, tekst zijn regels. */
const vlak = (x: number, y: number, w: number, h: number) => (
  <rect x={x} y={y} width={w} height={h} rx="1.5" fill="#9c8c78" />
);

const regels = (x: number, y: number, w: number, aantal = 3) => (
  <>
    {Array.from({ length: aantal }, (_, i) => (
      <rect
        key={i}
        x={x}
        y={y + i * 5}
        width={i === aantal - 1 ? w * 0.6 : w}
        height="2"
        rx="1"
        fill="#c9c0b2"
      />
    ))}
  </>
);

const doek = (inhoud: React.ReactNode) => (
  <svg viewBox="0 0 64 40" width="64" height="40" aria-hidden>
    <rect x="0.5" y="0.5" width="63" height="39" rx="3" fill="#faf8f4" stroke="#e7e2d9" />
    {inhoud}
  </svg>
);

const VORMEN: Vorm[] = [
  {
    waarde: "vol",
    naam: "Eén beeld",
    uitleg: "Schermvullend, tekst eroverheen",
    tekening: doek(
      <>
        {vlak(4, 4, 56, 32)}
        {regels(8, 24, 22, 2)}
      </>,
    ),
  },
  {
    waarde: "duo",
    naam: "Twee naast elkaar",
    uitleg: "Twee gelijke beelden met lucht eromheen",
    tekening: doek(
      <>
        {vlak(6, 7, 24, 20)}
        {vlak(34, 7, 24, 20)}
        {regels(6, 31, 20, 1)}
      </>,
    ),
  },
  {
    waarde: "versprongen",
    naam: "Versprongen",
    uitleg: "Een groot beeld met een kleiner dat zakt",
    tekening: doek(
      <>
        {vlak(5, 6, 33, 28)}
        {vlak(42, 15, 17, 14)}
      </>,
    ),
  },
  {
    waarde: "portret",
    naam: "Staand beeld",
    uitleg: "Eén staand beeld met veel lucht",
    tekening: doek(
      <>
        {vlak(16, 5, 18, 30)}
        {regels(39, 14, 18, 3)}
      </>,
    ),
  },
  {
    waarde: "tekst",
    naam: "Beeld met tekst",
    uitleg: "Ruimte voor een alinea uitleg",
    tekening: doek(
      <>
        {vlak(5, 6, 26, 28)}
        {regels(36, 12, 22, 4)}
      </>,
    ),
  },
  {
    waarde: "rust",
    naam: "Alleen tekst",
    uitleg: "Een adempauze tussen twee reeksen beeld",
    tekening: doek(regels(18, 15, 28, 3)),
  },
];

export default function SlideLayoutField({ path }: { path: string }) {
  const { value, setValue } = useField<string>({ path });
  const gekozen = value ?? "vol";

  return (
    <div className="bd-vormkiezer">
      <span className="bd-vormkiezer__kop">Hoe komt deze dia in beeld</span>

      <div className="bd-vormkiezer__rij" role="radiogroup" aria-label="Hoe komt deze dia in beeld">
        {VORMEN.map((vorm) => (
          <button
            key={vorm.waarde}
            type="button"
            role="radio"
            aria-checked={gekozen === vorm.waarde}
            title={vorm.uitleg}
            onClick={() => setValue(vorm.waarde)}
            className={`bd-vormkiezer__knop${gekozen === vorm.waarde ? " bd-vormkiezer__knop--aan" : ""}`}
          >
            {vorm.tekening}
            <span className="bd-vormkiezer__naam">{vorm.naam}</span>
          </button>
        ))}
      </div>

      <span className="bd-vormkiezer__uitleg">
        {VORMEN.find((v) => v.waarde === gekozen)?.uitleg}
      </span>
    </div>
  );
}
