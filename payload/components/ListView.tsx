import Link from "next/link";
import { getPayload, type Where } from "payload";
import config from "@payload-config";

import { LIST_SPECS, cellValue, type ListSpec } from "./listConfig";
import "./list.scss";

/*
 * De lijstweergave uit het ontwerp, voor elke collectie.
 *
 * Zoeken, sorteren en filteren lopen via de URL in plaats van via toestand in
 * de browser. Dat scheelt een client-component, houdt de pagina deelbaar en
 * maakt terug-navigeren voorspelbaar.
 */

const PER_PAGE = 20;

type SearchParams = Record<string, string | string[] | undefined>;

interface ListViewProps {
  collectionSlug?: string;
  params?: Promise<{ segments?: string[] }> | { segments?: string[] };
  searchParams?: Promise<SearchParams> | SearchParams;
}

function one(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

/** De slug staat in de props, en anders in het pad /admin/collections/<slug>. */
async function resolveSlug(props: ListViewProps): Promise<string> {
  if (props.collectionSlug) return props.collectionSlug;

  const params = await props.params;
  const segments = params?.segments ?? [];
  const index = segments.indexOf("collections");

  return index >= 0 ? (segments[index + 1] ?? "") : "";
}

export default async function ListView(props: ListViewProps) {
  const slug = await resolveSlug(props);
  const spec: ListSpec | undefined = LIST_SPECS[slug];

  // Een onbekende collectie laten we aan Payload's eigen melding over.
  if (!spec) return null;

  const searchParams = ((await props.searchParams) ?? {}) as SearchParams;

  const search = one(searchParams.zoek).trim();
  const sort = one(searchParams.sorteer) || spec.defaultSort;
  const visibility = one(searchParams.zicht) || "alles";
  const page = Math.max(1, Number(one(searchParams.pagina)) || 1);

  const where: Where = {};

  if (search) {
    where[spec.searchField] = { like: search };
  }

  if (spec.hasVisibility && visibility !== "alles") {
    where.published = { equals: visibility === "zichtbaar" };
  }

  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: slug as "projects",
    where: Object.keys(where).length > 0 ? where : undefined,
    sort,
    limit: spec.isMedia ? 24 : PER_PAGE,
    page,
    locale: "nl",
    depth: spec.isMedia ? 0 : 1,
  });

  const base = `/admin/collections/${slug}`;

  /** Houdt de andere keuzes vast bij het wisselen van één ervan. */
  const linkWith = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const current: Record<string, string> = {
      zoek: search,
      sorteer: one(searchParams.sorteer),
      zicht: one(searchParams.zicht),
    };

    for (const [key, value] of Object.entries({ ...current, ...changes })) {
      if (value) next.set(key, value);
    }

    const query = next.toString();
    return query ? `${base}?${query}` : base;
  };

  const gridCols = [
    "minmax(220px, 2fr)",
    ...spec.columns.map((column) => column.width),
    ...(spec.hasVisibility ? ["130px"] : []),
  ].join(" ");

  const visFilters = [
    { key: "alles", label: "Alles" },
    { key: "zichtbaar", label: "Zichtbaar" },
    { key: "verborgen", label: "Verborgen" },
  ];

  return (
    <div className="bd-list">
      <div className="bd-list__head">
        <div className="bd-list__intro">
          <h1 className="bd-list__title">{spec.label}</h1>
          <p className="bd-list__desc">{spec.description}</p>
        </div>

        <div className="bd-list__actions">
          <Link href={`${base}/create`} className="bd-btn bd-btn--primary">
            <span className="bd-btn__plus">+</span>
            {spec.newLabel}
          </Link>
        </div>
      </div>

      <div className="bd-list__controls">
        <form action={base} method="get" className="bd-search">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#8b847a" strokeWidth="1.5">
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3.5 3.5" />
          </svg>
          <input
            type="search"
            name="zoek"
            defaultValue={search}
            placeholder={spec.searchLabel}
            className="bd-search__input"
          />
          {one(searchParams.sorteer) && (
            <input type="hidden" name="sorteer" value={one(searchParams.sorteer)} />
          )}
          {one(searchParams.zicht) && <input type="hidden" name="zicht" value={one(searchParams.zicht)} />}
        </form>

        {spec.hasVisibility && (
          <div className="bd-pills">
            {visFilters.map((filter) => (
              <Link
                key={filter.key}
                href={linkWith({ zicht: filter.key === "alles" ? undefined : filter.key, pagina: undefined })}
                className={`bd-pills__item${visibility === filter.key ? " bd-pills__item--on" : ""}`}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {spec.isMedia ? (
        <div className="bd-grid">
          {result.docs.map((doc) => {
            const media = doc as { id: number | string; url?: string; alt?: string; filename?: string };

            return (
              <Link key={media.id} href={`${base}/${media.id}`} className="bd-card">
                <span
                  className="bd-card__thumb"
                  style={media.url ? { backgroundImage: `url(${media.url})` } : undefined}
                />
                <span className="bd-card__text">
                  <span className="bd-card__title">{media.alt || media.filename}</span>
                  <span className="bd-card__sub">{media.filename}</span>
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bd-table">
          <div className="bd-table__inner">
            <div className="bd-table__head" style={{ gridTemplateColumns: gridCols }}>
              <Link href={linkWith({ sorteer: spec.titleField })} className="bd-table__th">
                <span>Titel</span>
                <span className="bd-table__arrow">{sort === spec.titleField ? "↑" : ""}</span>
              </Link>

              {spec.columns.map((column) => (
                <Link key={column.field} href={linkWith({ sorteer: column.field })} className="bd-table__th">
                  <span>{column.label}</span>
                  <span className="bd-table__arrow">{sort === column.field ? "↑" : ""}</span>
                </Link>
              ))}

              {spec.hasVisibility && <span className="bd-table__th bd-table__th--plain">Zichtbaar</span>}
            </div>

            {result.docs.map((doc) => {
              const row = doc as Record<string, unknown> & { id: number | string };
              const live = row.published !== false;

              return (
                <Link
                  key={row.id}
                  href={`${base}/${row.id}`}
                  className="bd-table__row"
                  style={{ gridTemplateColumns: gridCols }}
                >
                  <span className="bd-table__main">
                    <span className="bd-table__text">
                      <span className="bd-table__name">{String(row[spec.titleField] ?? "Zonder titel")}</span>
                      {spec.subField && (
                        <span className="bd-table__sub">{String(row[spec.subField] ?? "")}</span>
                      )}
                    </span>
                  </span>

                  {spec.columns.map((column) => (
                    <span key={column.field} className="bd-table__cell">
                      {cellValue(row[column.field], column.kind)}
                    </span>
                  ))}

                  {spec.hasVisibility && (
                    <span>
                      <span className={`bd-pill${live ? " bd-pill--live" : ""}`}>
                        <span className="bd-pill__dot" />
                        {live ? "Zichtbaar" : "Verborgen"}
                      </span>
                    </span>
                  )}
                </Link>
              );
            })}

            {result.docs.length === 0 && (
              <p className="bd-table__empty">
                {search ? `Niets gevonden voor “${search}”.` : "Nog niets toegevoegd."}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="bd-list__foot">
        <span>
          {result.totalDocs} {result.totalDocs === 1 ? "item" : "items"}
        </span>

        {result.totalPages > 1 && (
          <span className="bd-pager">
            {Array.from({ length: result.totalPages }, (_, index) => index + 1).map((number) => (
              <Link
                key={number}
                href={linkWith({ pagina: String(number) })}
                className={`bd-pager__page${number === page ? " bd-pager__page--on" : ""}`}
              >
                {number}
              </Link>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
