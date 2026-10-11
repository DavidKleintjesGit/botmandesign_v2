import type { CollectionConfig } from "payload";

/*
 * De producten van de webshop.
 *
 * De prijs staat in centen, net als in de frontend: met kommagetallen rekenen
 * levert vroeg of laat een cent verschil op in een totaal. Het invoerveld
 * verwacht dus 8900 voor € 89,00 — dat staat er ook bij.
 */
export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Product",
    plural: "Producten",
  },
  admin: {
    components: {
      Description: {
        path: "/payload/components/EditKicker#default",
        clientProps: { singular: "Product", nieuw: "Nieuw product" },
      },
      edit: { SaveButton: "/payload/components/SaveBar#default" },
      views: {
        // De lijstweergave uit het ontwerp.
        list: { Component: "/payload/components/ListView#default" },
      },
    },
    useAsTitle: "name",
    defaultColumns: ["name", "category", "priceCents", "stock", "published"],
    group: "Webshop",
    description: "De artikelen in de collectie.",
  },
  access: {
    read: () => true,
  },
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
              name: "category",
              type: "select",
              label: "Categorie",
              required: true,
              options: [
                { label: "Vazen", value: "vazen" },
                { label: "Schalen", value: "schalen" },
                { label: "Verlichting", value: "verlichting" },
                { label: "Sculptuur", value: "objecten" },
              ],
              admin: { width: "33%" },
            },
            {
              name: "priceCents",
              type: "number",
              label: "Prijs in centen",
              required: true,
              min: 0,
              admin: {
                width: "33%",
                description: "8900 betekent € 89,00.",
              },
            },
            {
              name: "stock",
              type: "number",
              label: "Voorraad",
              min: 0,
              admin: {
                width: "34%",
                description:
                  "Leeg laten betekent onbeperkt. 0 toont 'uitverkocht'.",
              },
            },
          ],
        },
      ],
    },
    {
      name: "images",
      type: "array",
      label: "Beelden",
      labels: { singular: "Beeld", plural: "Beelden" },
      minRows: 1,
      required: true,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Beeld",
          required: true,
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
          name: "description",
          type: "textarea",
          label: "Omschrijving",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "specs",
      type: "array",
      label: "Details",
      labels: { singular: "Detail", plural: "Details" },
      admin: {
        description:
          "Materiaal, afmeting, herkomst — wat er op het kaartje hoort. Een regel zonder vertaling blijft in die taal gewoon leeg.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "label",
              type: "text",
              label: "Omschrijving",
              localized: true,
              admin: { width: "40%" },
            },
            {
              name: "value",
              type: "text",
              label: "Waarde",
              localized: true,
              admin: { width: "60%" },
            },
          ],
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
          label: "Zichtbaar in de collectie",
          defaultValue: true,
        },
      ],
    },
  ],
};
