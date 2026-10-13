/*
 * Zet een voorbeeldreeks klaar voor één project, zodat te zien is wat de
 * verschillende dia-vormen doen.
 *
 * De teksten hieronder zijn verzonnen; ze staan er om de vormen te kunnen
 * beoordelen en horen vervangen te worden door wat Bas er zelf over schrijft.
 * De beelden zijn de bestaande media — het zijn nog niet de foto's van dit
 * project.
 *
 * Draaien: node payload/migraties/voorbeeldreeks.mjs [pad-naar-db] [project-id]
 */

import Database from "libsql";
import crypto from "crypto";

const pad = process.argv[2] ?? "payload-data/payload.db";
const projectId = Number(process.argv[3] ?? 1);
const db = new Database(pad);

/*
 * Het ritme. Niet om de beurt een vorm, maar met opzet: beeld om in te komen,
 * dan lucht, dan uitleg, een stil moment halverwege, en een slotbeeld — geen
 * tekst als laatste, want dan eindigt een project op een woord in plaats van
 * op een ruimte.
 */
const reeks = [
  { v: "vol", nl: ["Woonkamer", "LICHT & RUIMTE", "Grote ramen en een zacht, natuurlijk kleurenpalet laten daglicht de ruimte vormgeven — rust als uitgangspunt."], en: ["Living room", "LIGHT & SPACE", "Large windows and a soft, natural palette let daylight shape the room — calm as the starting point."] },
  { v: "duo", nl: ["Keuken en eethoek", "HART VAN HET HUIS", "Twee ruimtes die in elkaar overlopen."], en: ["Kitchen and dining", "HEART OF THE HOUSE", "Two rooms that run into one another."] },
  {
    v: "tekst",
    nl: [
      "Werken vanuit het licht",
      "DE AANPAK",
      "De woning stond op het zuiden, maar het licht kwam nergens binnen: zware gordijnen, donkere vloeren en een indeling die de ramen de rug toekeerde. We zijn begonnen bij de plattegrond en niet bij de inrichting. De keuken verhuisde naar de achterzijde, de zitkamer schoof naar het raam, en de gang werd een halve meter smaller zodat de woonkamer die ruimte kreeg. Pas daarna kwamen de materialen: eiken dat warm blijft in de schaduw, natuursteen dat het licht juist terugkaatst, en textiel in tinten die met het uur van de dag meebewegen.",
    ],
    en: [
      "Working from the light",
      "THE APPROACH",
      "The house faced south, yet the light reached nowhere: heavy curtains, dark floors and a layout that turned its back on the windows. We began with the plan, not the furnishing. The kitchen moved to the rear, the sitting room shifted towards the window, and the hallway gave up half a metre so the living room could have it. Only then came the materials: oak that stays warm in shadow, natural stone that throws the light back, and textiles in tones that move with the hour.",
    ],
  },
  { v: "vol", nl: ["Zithoek", "DETAIL", "Boucle, brons en eikenhout — materialen die je wil aanraken."], en: ["Seating area", "DETAIL", "Boucle, bronze and oak — materials you want to touch."] },
  { v: "versprongen", nl: ["Slaapkamer", "RUST", "Minder spullen, meer ruimte om te ademen."], en: ["Bedroom", "QUIET", "Fewer things, more room to breathe."] },
  { v: "portret", nl: ["Trappenhuis", "LIJN", "Eén doorlopende lijn van beneden naar boven."], en: ["Stairwell", "LINE", "One continuous line from bottom to top."] },
  { v: "duo", nl: ["Badkamer", "MATERIAAL", "Natuursteen en messing, samen oud worden."], en: ["Bathroom", "MATERIAL", "Natural stone and brass, ageing together."] },
  { v: "vol", nl: ["Terras", "BUITEN", "De overgang naar buiten is nauwelijks te zien."], en: ["Terrace", "OUTSIDE", "The step outside is barely there."] },
  { v: "vol", nl: ["", "", ""], en: ["", "", ""] },
];

const media = db
  .prepare("select id from media where filename like '%.jpg' order by id")
  .all()
  .map((m) => m.id);

if (media.length < 6) {
  console.error("Te weinig beeld in de media om een reeks mee te maken.");
  process.exit(1);
}

const bestaand = db
  .prepare("select id from projects_slides where _parent_id = ? order by _order")
  .all(projectId);

db.exec("BEGIN");

try {
  // Schoon beginnen: de oude reeks eruit, de nieuwe erin.
  db.prepare("delete from projects_slides where _parent_id = ?").run(projectId);

  const zetDia = db.prepare(
    "insert into projects_slides (_order, _parent_id, id, layout, image_id, image_two_id) values (?, ?, ?, ?, ?, ?)",
  );
  const zetTekst = db.prepare(
    "insert into projects_slides_locales (caption, sub, body, _locale, _parent_id) values (?, ?, ?, ?, ?)",
  );

  reeks.forEach((dia, i) => {
    const id = crypto.randomBytes(12).toString("hex");
    const beeld = media[i % media.length];
    const tweede = dia.v === "duo" || dia.v === "versprongen" ? media[(i + 3) % media.length] : null;

    zetDia.run(i + 1, projectId, id, dia.v, dia.v === "rust" ? null : beeld, tweede);
    zetTekst.run(dia.nl[0], dia.nl[1], dia.nl[2], "nl", id);
    zetTekst.run(dia.en[0], dia.en[1], dia.en[2], "en", id);
  });

  db.exec("COMMIT");
} catch (fout) {
  db.exec("ROLLBACK");
  throw fout;
}

const na = db
  .prepare("select _order, layout from projects_slides where _parent_id = ? order by _order")
  .all(projectId);

console.log(`Project ${projectId}: ${bestaand.length} dia's vervangen door ${na.length}.`);
console.log(na.map((d) => d._order + " " + d.layout).join(", "));
