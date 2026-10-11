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
      // De bovenregel boven de titel op het bewerkscherm.
      Description: {
        path: "/payload/components/EditKicker#default",
        clientProps: { singular: "Klantcitaat", nieuw: "Nieuw citaat" },
      },
      // Terug naast Opslaan, zoals in het ontwerp.
      edit: { SaveButton: "/payload/components/SaveBar#default" },
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
    /*
     * De velden staan in genoemde blokken. Payload zet daar een collapsible
     * omheen; in het ontwerp is dat een kaart met een kop erboven.
     */
    {
      type: "collapsible",
      label: "Citaat",
      fields: [
        {
          name: "quote",
          type: "textarea",
          label: "Citaat",
          required: true,
          localized: true,
          admin: {
            description:
              "Zonder aanhalingstekens — die zet de site er zelf omheen.",
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
      ],
    },
    {
      // In het ontwerp staat dit in de zijkolom onder de kop Publicatie.
      type: "collapsible",
      label: "Publicatie",
      admin: { position: "sidebar" },
      fields: [
        {
          name: "published",
          type: "checkbox",
          label: "Zichtbaar op de site",
          defaultValue: true,
          admin: {
            description:
              "Alleen aanzetten als de klant hier toestemming voor gaf.",
          },
        },
      ],
    },
    {
      /*
       * De tweede kaart in de zijkolom heeft in het ontwerp geen kop; de
       * velden spreken voor zich. Payload wil wel een label, dus die wordt
       * verborgen via bd-kaart-zonder-kop.
       */
      type: "collapsible",
      label: "Instellingen",
      admin: { position: "sidebar", className: "bd-kaart-zonder-kop" },
      fields: [
        {
          name: "order",
          type: "number",
          label: "Volgorde",
          defaultValue: 0,
          admin: { description: "Lager komt eerder aan de beurt." },
        },
        {
          name: "placeholder",
          type: "checkbox",
          label: "Voorbeeldtekst",
          defaultValue: false,
          admin: {
            description:
              "Verzonnen citaat om de site te kunnen tonen. Moet weg of vervangen zijn voordat de site live gaat.",
          },
        },
      ],
    },
  ],
};
