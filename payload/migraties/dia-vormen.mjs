/*
 * Geeft een dia in de beeldenreeks een vorm en een tweede beeld.
 *
 * Waarom met de hand en niet via push: het beeld was verplicht en is dat niet
 * meer, want een dia met alleen tekst heeft er geen. In SQLite kun je NOT NULL
 * niet van een kolom afhalen, dus moet de tabel opnieuw worden opgebouwd — en
 * de opdracht die drizzle daarvoor maakt leest de nieuwe kolommen uit de oude
 * tabel en loopt daarop stuk. Dit doet dezelfde stap wél in de goede volgorde.
 *
 * Herhaalbaar: staat de kolom layout er al, dan gebeurt er niets.
 *
 * Draaien: node payload/migraties/dia-vormen.mjs [pad-naar-db]
 */

import Database from "libsql";

const pad = process.argv[2] ?? "payload-data/payload.db";
const db = new Database(pad);

const kolommen = db.prepare("PRAGMA table_info(projects_slides)").all().map((k) => k.name);

if (kolommen.includes("layout")) {
  console.log("Niets te doen: dia-vormen staan er al.");
  process.exit(0);
}

const voor = db.prepare("select count(*) as n from projects_slides").get().n;

db.exec("PRAGMA foreign_keys=OFF");
db.exec("BEGIN");

try {
  db.exec(`
    CREATE TABLE projects_slides_nieuw (
      _order integer NOT NULL,
      _parent_id integer NOT NULL,
      id text PRIMARY KEY NOT NULL,
      layout text,
      image_id integer,
      image_two_id integer,
      FOREIGN KEY (image_id) REFERENCES media(id) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (image_two_id) REFERENCES media(id) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (_parent_id) REFERENCES projects(id) ON UPDATE no action ON DELETE cascade
    )
  `);

  // Alles wat er stond was een schermvullend beeld; dat is vorm "vol".
  db.exec(`
    INSERT INTO projects_slides_nieuw (_order, _parent_id, id, layout, image_id, image_two_id)
    SELECT _order, _parent_id, id, 'vol', image_id, NULL FROM projects_slides
  `);

  db.exec("DROP TABLE projects_slides");
  db.exec("ALTER TABLE projects_slides_nieuw RENAME TO projects_slides");

  db.exec("CREATE INDEX projects_slides_order_idx ON projects_slides (_order)");
  db.exec("CREATE INDEX projects_slides_parent_id_idx ON projects_slides (_parent_id)");
  db.exec("CREATE INDEX projects_slides_image_idx ON projects_slides (image_id)");
  db.exec("CREATE INDEX projects_slides_image_two_idx ON projects_slides (image_two_id)");

  db.exec("COMMIT");
} catch (fout) {
  db.exec("ROLLBACK");
  throw fout;
}

db.exec("PRAGMA foreign_keys=ON");

const na = db.prepare("select count(*) as n from projects_slides").get().n;
console.log(`Dia-vormen toegevoegd. Rijen voor: ${voor}, na: ${na}.`);

if (voor !== na) {
  console.error("Aantal rijen klopt niet — controleer de kopie van de database.");
  process.exit(1);
}
