"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import "./nav.scss";

/*
 * De zijbalk uit het ontwerp. Alleen de weergave zit hier; de aantallen en de
 * ingelogde gebruiker komen van de serverkant in Nav.tsx.
 *
 * Client-component omdat de actieve regel uit het pad volgt.
 */

export interface NavItem {
  slug: string;
  label: string;
  count: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export default function NavClient({
  groups,
  userName,
  userEmail,
}: {
  groups: NavGroup[];
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname() ?? "";

  const onHome = /\/admin\/?$/.test(pathname);
  const initial = (userName || userEmail || "?").trim().charAt(0).toUpperCase();

  return (
    <aside className="bd-nav">
      <Link href="/admin" className="bd-nav__brand">
        <span className="bd-nav__brand-name">Botman Design</span>
        <span className="bd-nav__brand-sub">Beheer</span>
      </Link>

      <Link
        href="/admin"
        className={`bd-nav__home${onHome ? " bd-nav__home--active" : ""}`}
      >
        Overzicht
      </Link>

      {groups.map((group) => (
        <div key={group.label} className="bd-nav__group">
          <span className="bd-nav__group-label">{group.label}</span>

          {group.items.map((item) => {
            const href = `/admin/collections/${item.slug}`;
            const active = pathname.startsWith(href);

            return (
              <Link
                key={item.slug}
                href={href}
                className={`bd-nav__item${active ? " bd-nav__item--active" : ""}`}
              >
                <span>{item.label}</span>
                <span className="bd-nav__count">{item.count}</span>
              </Link>
            );
          })}
        </div>
      ))}

      <div className="bd-nav__user">
        <span className="bd-nav__avatar" aria-hidden>
          {initial}
        </span>

        <span className="bd-nav__who">
          <span className="bd-nav__name">{userName || "Beheerder"}</span>
          <span className="bd-nav__email">{userEmail}</span>
        </span>

        <Link href="/admin/logout" className="bd-nav__logout" title="Uitloggen" aria-label="Uitloggen">
          ⇥
        </Link>
      </div>
    </aside>
  );
}
