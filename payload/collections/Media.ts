import type { CollectionConfig } from "payload";

/*
 * Geüploade beelden. Ze landen buiten de applicatiemap, want een deploy leegt
 * die map en dan zouden alle foto's van Bas verdwijnen.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Instellingen",
  },
  access: {
    // Beelden horen op de site zichtbaar te zijn, ook voor wie niet ingelogd is.
    read: () => true,
  },
  upload: {
    staticDir: process.env.PAYLOAD_MEDIA_DIR ?? "payload-data/media",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "card", width: 900, height: undefined, position: "centre" },
      { name: "full", width: 1800, height: undefined, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Omschrijving van het beeld",
      required: true,
      admin: {
        description: "Wat is er te zien? Voorleessoftware en zoekmachines gebruiken dit.",
      },
    },
  ],
};
