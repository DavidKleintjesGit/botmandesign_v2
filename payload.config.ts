import path from "path";
import { fileURLToPath } from "url";

import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

import { Media } from "./payload/collections/Media";
import { Products } from "./payload/collections/Products";
import { Projects } from "./payload/collections/Projects";
import { ServicesCollection } from "./payload/collections/Services";
import { Testimonials } from "./payload/collections/Testimonials";
import { Users } from "./payload/collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/*
 * SQLite in plaats van Postgres: er draait op deze server geen databaseserver
 * en voor dit aantal producten en projecten is dat ook niet nodig. Het bestand
 * staat bewust buiten de applicatiemap, want een deploy leegt die map.
 */
const databaseUrl =
  process.env.DATABASE_URI ?? `file:${path.resolve(dirname, "payload-data/payload.db")}`;

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Botman Design",
    },
    components: {
      // De zijbalk uit het ontwerp in plaats van die van Payload.
      Nav: "/payload/components/Nav#default",
      views: {
        // Het beginscherm uit het ontwerp in plaats van de standaardlijst.
        dashboard: {
          Component: "/payload/components/Dashboard#default",
        },
      },
    },
  },

  collections: [Projects, ServicesCollection, Testimonials, Products, Media, Users],

  editor: lexicalEditor(),

  /*
   * De site heeft zelf al /api/contact. Payload krijgt daarom een eigen pad,
   * zodat de twee elkaar niet in de weg zitten.
   */
  routes: {
    api: "/payload-api",
  },

  db: sqliteAdapter({
    client: { url: databaseUrl },
    /*
     * Payload past het schema normaal alleen in development vanzelf aan en
     * verwacht op productie migraties. De migratie-CLI loopt hier vast op
     * dezelfde CommonJS-beperking als de scriptrunner, dus laten we het schema
     * ook op de server de code volgen. Het vangnet daarvoor staat in deploy.sh:
     * die maakt eerst een kopie van de database.
     */
    push: true,
  }),

  secret: process.env.PAYLOAD_SECRET ?? "",

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // Beide talen in één beheeromgeving, met Nederlands als standaard.
  localization: {
    locales: [
      { label: "Nederlands", code: "nl" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "nl",
    fallback: true,
  },

  sharp: undefined,
});
