import type { CollectionConfig } from "payload";

/** De beheerders die op /admin kunnen inloggen. */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    components: {
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
