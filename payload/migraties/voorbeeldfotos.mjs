/*
 * Haalt een reeks voorbeeldfoto's op en zet ze als projectbeeld klaar.
 *
 * Dit zijn foto's van Unsplash — vrij te gebruiken, maar niet het werk van
 * Bas. Ze staan er om te kunnen beoordelen hoe de projectpagina leest met
 * genoeg beeld; met zeven placeholders viel daar niets van te zien. Weg ermee
 * zodra er echte projectfotografie is.
 *
 * De foto's komen als bestand binnen en niet als adres: Payload leidt de url
 * van een beeld altijd af uit de bestandsnaam, dus een externe link overleeft
 * het uitlezen niet.
 *
 * Draaien: node payload/migraties/voorbeeldfotos.mjs [pad-naar-db] [media-map] [project-id]
 */

import Database from "libsql";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const FOTOS = [
  "photo-1564078516393-cf04bd966897",
  "photo-1630587148265-761cbd139043",
  "photo-1599696848652-f0ff23bc911f",
  "photo-1613545325278-f24b0cae1224",
  "photo-1581784878214-8d5596b98a01",
  "photo-1578683010236-d716f9a3f461",
  "photo-1600210491892-03d54c0aaf87",
  "photo-1562438668-bcf0ca6578f0",
  "photo-1621293954908-907159247fc8",
  "photo-1518733057094-95b53143d2a7",
  "photo-1583847268964-b28dc8f51f92",
  "photo-1631679706909-1844bbd07221",
  "photo-1618220179428-22790b461013",
  "photo-1598928506311-c55ded91a20c",
  "photo-1586023492125-27b2c045efd7",
  "photo-1605774337664-7a846e9cdf17",
  "photo-1632829882891-5047ccc421bc",
  "photo-1724582586529-62622e50c0b3",
];

const BREEDTE = 2000;
const HOOGTE = 1333;

/*
 * De tekststroken. Kort gehouden: je komt er langs terwijl je scrolt, je gaat
 * er niet zitten. Verzonnen tekst — vervangen voordat de site live gaat.
 */
const TEKSTEN = [
  {
    nl: [
      "Werken vanuit het licht",
      "DE AANPAK",
      "De woning keerde de ramen de rug toe. We zijn begonnen bij de plattegrond: de keuken naar achteren, de zitkamer naar het raam, de gang een halve meter smaller.",
    ],
    en: [
      "Working from the light",
      "THE APPROACH",
      "The house turned its back on its windows. We began with the plan: the kitchen to the rear, the sitting room towards the window, the hallway half a metre narrower.",
    ],
  },
  {
    nl: [
      "Materiaal dat meegaat",
      "DETAIL",
      "Eiken dat warm blijft in de schaduw, natuursteen dat het licht terugkaatst, textiel in tinten die met het uur van de dag meebewegen.",
    ],
    en: [
      "Material that lasts",
      "DETAIL",
      "Oak that stays warm in shadow, natural stone that throws light back, textiles in tones that move with the hour.",
    ],
  },
];

const dbPad = process.argv[2] ?? "payload-data/payload.db";
const mediaMap = process.argv[3] ?? "payload-data/media";
const projectId = Number(process.argv[4] ?? 1);

fs.mkdirSync(mediaMap, { recursive: true });

/* Eerst binnenhalen, dan pas de database aanraken. */
const opgehaald = [];

for (const foto of FOTOS) {
  const naam = `voorbeeld-${foto}.jpg`;
  const doel = path.join(mediaMap, naam);

  if (!fs.existsSync(doel)) {
    const adres = `https://images.unsplash.com/${foto}?auto=format&fit=crop&w=${BREEDTE}&q=80`;
    const antwoord = await fetch(adres);

    if (!antwoord.ok) {
      console.error(`Overgeslagen (${antwoord.status}): ${foto}`);
      continue;
    }

    fs.writeFileSync(doel, Buffer.from(await antwoord.arrayBuffer()));
  }

  opgehaald.push({ naam, grootte: fs.statSync(doel).size });
}

console.log(`${opgehaald.length} foto's in ${mediaMap}.`);

const db = new Database(dbPad);
db.exec("BEGIN");

try {
  const bestaat = db.prepare("select id from media where filename = ?");
  const nieuw = db.prepare(
    "insert into media (alt, url, filename, mime_type, width, height, filesize) values (?, ?, ?, ?, ?, ?, ?)",
  );

  const ids = opgehaald.map((foto, i) => {
    const al = bestaat.get(foto.naam);
    if (al) return al.id;

    const uit = nieuw.run(
      `Voorbeeldfoto ${i + 1}`,
      `/payload-api/media/file/${foto.naam}`,
      foto.naam,
      "image/jpeg",
      BREEDTE,
      HOOGTE,
      foto.grootte,
    );
    return Number(uit.lastInsertRowid);
  });

  db.prepare("delete from projects_slides where _parent_id = ?").run(projectId);

  const zetDia = db.prepare(
    "insert into projects_slides (_order, _parent_id, id, layout, image_id, image_two_id) values (?, ?, ?, ?, ?, ?)",
  );
  const zetTekst = db.prepare(
    "insert into projects_slides_locales (caption, sub, body, _locale, _parent_id) values (?, ?, ?, ?, ?)",
  );

  let volgorde = 0;
  let tekstBeurt = 0;

  ids.forEach((mediaId, i) => {
    volgorde += 1;
    const diaId = crypto.randomBytes(12).toString("hex");
    zetDia.run(volgorde, projectId, diaId, "vol", mediaId, null);
    zetTekst.run("", "", "", "nl", diaId);
    zetTekst.run("", "", "", "en", diaId);

    // Om de zes beelden een strook tekst, en nooit als laatste.
    const laatste = i === ids.length - 1;
    if (!laatste && (i + 1) % 6 === 0 && tekstBeurt < TEKSTEN.length) {
      const tekst = TEKSTEN[tekstBeurt];
      tekstBeurt += 1;

      volgorde += 1;
      const tekstId = crypto.randomBytes(12).toString("hex");
      zetDia.run(volgorde, projectId, tekstId, "rust", null, null);
      zetTekst.run(tekst.nl[0], tekst.nl[1], tekst.nl[2], "nl", tekstId);
      zetTekst.run(tekst.en[0], tekst.en[1], tekst.en[2], "en", tekstId);
    }
  });

  /* Het openingsbeeld is de eerste foto, zodat het niet dubbel in de reeks staat. */
  db.prepare("update projects set card_image_id = ? where id = ?").run(ids[0], projectId);

  db.exec("COMMIT");
} catch (fout) {
  db.exec("ROLLBACK");
  throw fout;
}

const dias = db
  .prepare("select layout from projects_slides where _parent_id = ? order by _order")
  .all(projectId);

console.log(
  `Project ${projectId}: ${dias.length} dia's — ${dias.filter((d) => d.layout === "vol").length} beeld, ${dias.filter((d) => d.layout === "rust").length} tekst.`,
);
