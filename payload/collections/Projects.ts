import type { CollectionConfig } from "payload";

/*
 * Een project zoals het op /projecten en /projecten/[slug] verschijnt.
 *
 * De velden volgen wat de pagina's nu uit app/content/projects.ts halen, zodat
 * de overstap naar deze collectie geen herontwerp vraagt.
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: {
    singular: "Project",
    plural: "Projecten",
  },
  admin: {
    components: {
      Description: {
        path: "/payload/components/EditKicker#default",
        clientProps: { singular: "Project", nieuw: "Nieuw project" },
      },
      edit: { SaveButton: "/payload/components/SaveBar#default" },
      views: {
        // De lijstweergave uit het ontwerp.
        list: { Component: "/payload/components/ListView#default" },
      },
    },
    useAsTitle: "title",
    defaultColumns: ["title", "number", "year", "published"],
    group: "Website",
    description: "De projecten op de projectenpagina en op de homepage.",
  },
  access: {
    read: () => true,
  },
  defaultSort: "number",
  fields: [
    /*
     * De velden staan in genoemde blokken, zoals in het ontwerp. Een blok met
     * losse velden is een collapsible; een blok dat uit één reeks bestaat is de
     * reeks zelf, want die brengt zijn eigen kop en toelichting al mee.
     */
    {
      type: "collapsible",
      label: "Algemeen",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Titel",
          required: true,
          localized: true,
        },
        {
          name: "slug",
          type: "text",
          label: "Adres in de URL",
          required: true,
          unique: true,
          admin: {
            description:
              "Bijvoorbeeld villa-oltera — dit wordt /projecten/villa-oltera.",
          },
        },
        {
          type: "row",
          fields: [
            {
              name: "number",
              type: "text",
              label: "Volgnummer",
              required: true,
              admin: {
                width: "33%",
                description: "01, 02, 03 — bepaalt ook de volgorde.",
              },
            },
            {
              name: "year",
              type: "text",
              label: "Jaar",
              required: true,
              admin: { width: "33%" },
            },
            {
              name: "category",
              type: "text",
              label: "Categorie",
              defaultValue: "Interior design",
              localized: true,
              admin: { width: "34%" },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Hoofdbeeld & inleiding",
      fields: [
        {
          name: "cardImage",
          type: "upload",
          relationTo: "media",
          label: "Hoofdbeeld",
          required: true,
          admin: {
            description:
              "Het beeld in het overzicht en bovenaan de projectpagina.",
          },
        },
        {
          name: "intro",
          type: "textarea",
          label: "Inleiding",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "slides",
      type: "array",
      label: "Beeldenreeks",
      labels: { singular: "Beeld", plural: "Beelden" },
      admin: {
        description:
          "De diashow op de projectpagina. Elk beeld vult één scherm; een bijschrift is optioneel.",
      },
      fields: [
        {
          name: "layout",
          type: "select",
          label: "Hoe komt deze dia in beeld",
          defaultValue: "vol",
          required: true,
          options: [
            { label: "Eén beeld, schermvullend", value: "vol" },
            { label: "Twee beelden naast elkaar", value: "duo" },
            { label: "Twee beelden, versprongen", value: "versprongen" },
            { label: "Eén staand beeld, met lucht eromheen", value: "portret" },
            { label: "Beeld met tekst ernaast", value: "tekst" },
            { label: "Alleen tekst — een adempauze", value: "rust" },
          ],
          admin: {
            // Tekeningetjes in plaats van een keuzelijst; zie SlideLayoutField.
            components: { Field: "/payload/components/SlideLayoutField#default" },
          },
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Beeld",
          admin: {
            condition: (_data, siblingData) => siblingData?.layout !== "rust",
          },
        },
        {
          name: "imageTwo",
          type: "upload",
          relationTo: "media",
          label: "Tweede beeld",
          admin: {
            condition: (_data, siblingData) =>
              siblingData?.layout === "duo" ||
              siblingData?.layout === "versprongen",
            description: "Komt rechts van het eerste te staan.",
          },
        },
        {
          name: "caption",
          type: "text",
          label: "Bijschrift",
          localized: true,
        },
        {
          name: "sub",
          type: "text",
          label: "Bovenschrift",
          localized: true,
          admin: { description: "Bijvoorbeeld EIKENHOUT — NATUURSTEEN." },
        },
        {
          name: "body",
          type: "textarea",
          label: "Toelichting",
          localized: true,
          admin: {
            description:
              "Bij 'Beeld met tekst ernaast' is dit de plek om echt iets uit te leggen — een alinea, geen bijschrift.",
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Materiaal",
      fields: [
        {
          name: "materialQuote",
          type: "textarea",
          label: "Citaat",
          localized: true,
        },
        {
          name: "materialsList",
          type: "text",
          label: "Materialen",
          localized: true,
          admin: {
            description:
              "Bijvoorbeeld Boucle · Eikenhout · Natuursteen · Brons.",
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
        },
      ],
    },
  ],
};
