import type { CollectionConfig } from "payload";

/*
 * Wat klanten zeggen. De homepage laat ze om beurten zien, dus hoe meer er
 * staan hoe langer de reeks duurt. Eén citaat werkt ook: dan blijft dat staan.
 *
 * De volgorde komt uit het veld "order"; gelijke nummers vallen terug op de
 * datum van aanmaken.
 */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: {
    singular: "Klantcitaat",
    plural: "Wat klanten zeggen",
  },
  admin: {
    components: {
      views: {
        // De lijstweergave uit het ontwerp.
        list: { Component: "/payload/components/ListView#default" },
      },
    },
    useAsTitle: "attribution",
    defaultColumns: ["attribution", "order", "published"],
    group: "Website",
    description: "De citaten die op de homepage rouleren.",
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  fields: [
    {
      name: "quote",
      type: "textarea",
      label: "Citaat",
      required: true,
      localized: true,
      admin: {
        description: "Zonder aanhalingstekens — die zet de site er zelf omheen.",
      },
    },
    {
      name: "attribution",
      type: "text",
      label: "Van wie",
      required: true,
      localized: true,
      admin: {
        description: "Bijvoorbeeld de projectnaam of de naam van de klant.",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Volgorde",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lager komt eerder aan de beurt.",
      },
    },
    {
      name: "placeholder",
      type: "checkbox",
      label: "Voorbeeldtekst",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Verzonnen citaat om de site te kunnen tonen. Moet weg of vervangen zijn voordat de site live gaat.",
      },
    },
    {
      name: "published",
      type: "checkbox",
      label: "Zichtbaar op de site",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Alleen aanzetten als de klant hier toestemming voor gaf.",
      },
    },
  ],
};
