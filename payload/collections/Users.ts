import type { CollectionConfig } from "payload";

/** De beheerders die op /admin kunnen inloggen. */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    components: {
      Description: {
        path: "/payload/components/EditKicker#default",
        clientProps: { singular: "Gebruiker", nieuw: "Nieuwe gebruiker" },
      },
      edit: { SaveButton: "/payload/components/SaveBar#default" },
      views: {
        // De lijstweergave uit het ontwerp.
        list: { Component: "/payload/components/ListView#default" },
      },
    },
    useAsTitle: "email",
    group: "Instellingen",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Naam",
    },
  ],
};
