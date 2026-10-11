import type { CollectionConfig } from "payload";

/*
 * De studio services. De velden die Bas nog niet heeft aangeleverd — redenen,
 * stappen en een klantcitaat — staan er wel in maar zijn optioneel: de
 * detailpagina slaat die secties over zolang ze leeg zijn.
 */
export const ServicesCollection: CollectionConfig = {
  slug: "services",
  labels: {
    singular: "Service",
    plural: "Services",
  },
  admin: {
    components: {
      Description: {
        path: "/payload/components/EditKicker#default",
        clientProps: { singular: "Service", nieuw: "Nieuwe service" },
      },
      edit: { SaveButton: "/payload/components/SaveBar#default" },
      views: {
        // De lijstweergave uit het ontwerp.
        list: { Component: "/payload/components/ListView#default" },
      },
    },
    useAsTitle: "name",
    defaultColumns: ["name", "number", "price", "published"],
    group: "Website",
    description:
      "De diensten op de homepage, het overzicht en de detailpagina's.",
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
          name: "name",
          type: "text",
          label: "Naam",
          required: true,
          localized: true,
        },
        {
          name: "slug",
          type: "text",
          label: "Adres in de URL",
          required: true,
          unique: true,
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
                width: "50%",
                description: "01, 02, 03 — bepaalt de volgorde.",
              },
            },
            {
              name: "price",
              type: "text",
              label: "Prijs",
              required: true,
              localized: true,
              admin: {
                width: "50%",
                description: "Bijvoorbeeld Vanaf € 7.500.",
              },
            },
          ],
        },
      ],
    },
    {
      type: "collapsible",
      label: "Tekst",
      fields: [
        {
          name: "tagline",
          type: "text",
          label: "Eén regel onder de titel",
          localized: true,
          required: true,
        },
        {
          name: "introOne",
          type: "textarea",
          label: "Beschrijving",
          localized: true,
          required: true,
        },
        {
          name: "introTwo",
          type: "textarea",
          label: "Tweede alinea",
          localized: true,
        },
      ],
    },
    {
      type: "collapsible",
      label: "Beelden",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "cardImage",
              type: "upload",
              relationTo: "media",
              label: "Beeld in het overzicht",
              admin: { width: "50%" },
            },
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              label: "Beeld bovenaan de pagina",
              admin: { width: "50%" },
            },
          ],
        },
      ],
    },
    {
      name: "reasons",
      type: "array",
      label: "Waarom deze service",
      labels: { singular: "Reden", plural: "Redenen" },
      admin: {
        description: "Laat leeg en de sectie verschijnt niet op de pagina.",
      },
      fields: [
        {
          name: "text",
          type: "textarea",
          label: "Reden",
          localized: true,
        },
      ],
    },
    {
      name: "steps",
      type: "array",
      label: "Hoe het werkt",
      labels: { singular: "Stap", plural: "Stappen" },
      admin: {
        description: "De stappen van het traject. Leeg laten mag ook.",
      },
      fields: [
        {
          name: "title",
          type: "text",
          label: "Titel",
          localized: true,
        },
        {
          name: "body",
          type: "textarea",
          label: "Toelichting",
          localized: true,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Beeld",
        },
      ],
    },
    {
      type: "collapsible",
      label: "Klantcitaat",
      admin: {
        description:
          "Alleen invullen als de klant hier toestemming voor heeft gegeven.",
      },
      fields: [
        {
          name: "quote",
          type: "textarea",
          label: "Citaat",
          localized: true,
        },
        {
          name: "quoteAttr",
          type: "text",
          label: "Van wie",
          localized: true,
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
