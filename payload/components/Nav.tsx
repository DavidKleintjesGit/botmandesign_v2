import { getPayload } from "payload";
import config from "@payload-config";

import NavClient, { type NavGroup } from "./NavClient";

/*
 * De zijbalk van het beheerpaneel. Vervangt die van Payload zodat hij het
 * ontwerp volgt; de weergave zit in NavClient, hier halen we alleen op wat
 * daarvoor nodig is.
 */

const GROUPS: Array<{ label: string; items: Array<{ slug: NavSlug; label: string }> }> = [
  {
    label: "Website",
    items: [
      { slug: "projects", label: "Projecten" },
      { slug: "services", label: "Services" },
      { slug: "testimonials", label: "Wat klanten zeggen" },
    ],
  },
  {
    label: "Webshop",
    items: [{ slug: "products", label: "Producten" }],
  },
  {
    label: "Instellingen",
    items: [
      { slug: "media", label: "Media" },
      { slug: "users", label: "Gebruikers" },
    ],
  },
];

type NavSlug = "projects" | "services" | "testimonials" | "products" | "media" | "users";

/** Payload geeft de ingelogde gebruiker mee aan een eigen Nav. */
type NavProps = {
  user?: { name?: string | null; email?: string | null } | null;
};

export default async function Nav({ user }: NavProps) {
  const payload = await getPayload({ config });

  const groups: NavGroup[] = await Promise.all(
    GROUPS.map(async (group) => ({
      label: group.label,
      items: await Promise.all(
        group.items.map(async (item) => {
          const total = await payload.count({ collection: item.slug });
          return { slug: item.slug, label: item.label, count: total.totalDocs };
        }),
      ),
    })),
  );

  return (
    <NavClient
      groups={groups}
      userName={user?.name ?? ""}
      userEmail={user?.email ?? ""}
    />
  );
}
