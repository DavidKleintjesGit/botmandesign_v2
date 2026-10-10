import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";

import "./dashboard.scss";

/*
 * Het beginscherm van het beheerpaneel, naar het ontwerp: een groet, tegels per
 * collectie met hun aantal, en wat er als laatste bewerkt is.
 *
 * Payload levert hier zelf een lijst met collecties; die vervangen we omdat de
 * tegels meer vertellen — hoeveel er staat en hoeveel daarvan zichtbaar is.
 */

type TileSpec = {
  slug: "projects" | "services" | "products" | "testimonials" | "media" | "users";
  label: string;
  group: string;
  /** Veld dat bepaalt of iets op de site staat; niet elke collectie heeft er een. */
  visibility?: "published";
};

const TILES: TileSpec[] = [
  { slug: "projects", label: "Projecten", group: "Website", visibility: "published" },
  { slug: "services", label: "Services", group: "Website", visibility: "published" },
  { slug: "testimonials", label: "Wat klanten zeggen", group: "Website", visibility: "published" },
  { slug: "products", label: "Producten", group: "Webshop", visibility: "published" },
  { slug: "media", label: "Media", group: "Instellingen" },
  { slug: "users", label: "Gebruikers", group: "Instellingen" },
];

const COLLECTION_LABELS: Record<string, string> = {
  projects: "Projecten",
  services: "Services",
  testimonials: "Wat klanten zeggen",
  products: "Producten",
  media: "Media",
  users: "Gebruikers",
};

function greeting(hour: number): string {
  if (hour < 6) return "Goedenacht";
  if (hour < 12) return "Goedemorgen";
  if (hour < 18) return "Goedemiddag";
  return "Goedenavond";
}

/** "3 dagen geleden" leest prettiger dan een datum die je moet narekenen. */
function sinceLabel(iso: string | null | undefined): string {
  if (!iso) return "";

  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);

  if (minutes < 1) return "zojuist";
  if (minutes < 60) return `${minutes} min geleden`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours === 1 ? "een uur geleden" : `${hours} uur geleden`;

  const days = Math.round(hours / 24);
  if (days === 1) return "gisteren";
  if (days < 30) return `${days} dagen geleden`;

  return new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long" }).format(new Date(iso));
}

export default async function Dashboard() {
  const payload = await getPayload({ config });
  const now = new Date();

  const tiles = await Promise.all(
    TILES.map(async (tile) => {
      const total = await payload.count({ collection: tile.slug });

      let note = total.totalDocs === 1 ? "1 item" : `${total.totalDocs} items`;

      if (tile.visibility) {
        const live = await payload.count({
          collection: tile.slug,
          where: { published: { equals: true } },
        });
        note =
          live.totalDocs === total.totalDocs
            ? "alles zichtbaar"
            : `${live.totalDocs} zichtbaar op de site`;
      }

      return { ...tile, count: total.totalDocs, note };
    }),
  );

  // Alles wat inhoud is, op volgorde van laatst bewerkt.
  const editable = ["projects", "services", "testimonials", "products"] as const;

  const recentPerCollection = await Promise.all(
    editable.map(async (slug) => {
      const found = await payload.find({
        collection: slug,
        sort: "-updatedAt",
        limit: 5,
        locale: "nl",
        depth: 0,
      });

      return found.docs.map((doc) => ({
        id: String(doc.id),
        collection: slug,
        title:
          (doc as { name?: string; title?: string; attribution?: string }).name ??
          (doc as { title?: string }).title ??
          (doc as { attribution?: string }).attribution ??
          "Zonder titel",
        updatedAt: (doc as { updatedAt?: string }).updatedAt ?? null,
      }));
    }),
  );

  const recent = recentPerCollection
    .flat()
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, 6);

  const today = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  return (
    <div className="bd-dashboard">
      <header className="bd-dashboard__intro">
        <p className="bd-dashboard__date">{today}</p>
        <h1 className="bd-dashboard__greeting">{greeting(now.getHours())}</h1>
      </header>

      <div className="bd-dashboard__tiles">
        {tiles.map((tile) => (
          <Link key={tile.slug} href={`/admin/collections/${tile.slug}`} className="bd-tile">
            <span className="bd-tile__head">
              <span className="bd-tile__label">{tile.label}</span>
              <span className="bd-tile__group">{tile.group}</span>
            </span>
            <span className="bd-tile__foot">
              <span className="bd-tile__count">{tile.count}</span>
              <span className="bd-tile__note">{tile.note}</span>
            </span>
          </Link>
        ))}
      </div>

      <section className="bd-recent">
        <h2 className="bd-recent__title">Recent bewerkt</h2>

        {recent.length === 0 ? (
          <p className="bd-recent__empty">Nog niets bewerkt.</p>
        ) : (
          <div className="bd-recent__list">
            {recent.map((item) => (
              <Link
                key={`${item.collection}-${item.id}`}
                href={`/admin/collections/${item.collection}/${item.id}`}
                className="bd-recent__row"
              >
                <span className="bd-recent__dot" aria-hidden />
                <span className="bd-recent__text">
                  <span className="bd-recent__name">{item.title}</span>
                  <span className="bd-recent__collection">
                    {COLLECTION_LABELS[item.collection] ?? item.collection}
                  </span>
                </span>
                <span className="bd-recent__since">{sinceLabel(item.updatedAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
