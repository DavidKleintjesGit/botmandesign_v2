import { getPayload } from "payload";
import config from "@payload-config";

import type { Product, ProductCategory } from "@/app/content/products";
import type { SlideLayout, Project } from "@/app/content/projects";
import type { Service } from "@/app/content/services";
import type { Testimonial } from "@/app/content/testimonials";

/*
 * De brug tussen de database en de pagina's.
 *
 * Alles wordt opgehaald met locale "all", zodat beide talen in één keer
 * meekomen. De taalknop werkt namelijk in de browser: zou de server maar één
 * taal sturen, dan moest elke wissel opnieuw langs de server.
 *
 * De functies leveren precies de vormen die de componenten al kenden toen de
 * content nog in app/content/ stond. Daardoor hoefde aan de pagina's zelf
 * weinig te veranderen.
 */

type Localized<T> = { nl?: T | null; en?: T | null } | T | null | undefined;

/*
 * De gegenereerde Payload-types zijn hier niet beschikbaar: de generator loopt
 * vast op dezelfde CommonJS-beperking als de scriptrunner. Daarom beschrijven
 * we de velden die we gebruiken zelf — alleen die, niet het hele document.
 */
type Row = Record<string, unknown>;

/** Payload geeft bij locale "all" een object per taal terug; anders een waarde. */
function pick(value: Localized<string>, language: "nl" | "en"): string {
  if (value && typeof value === "object") return (value as Record<string, string>)[language] ?? "";
  return (value as string) ?? "";
}

type MediaLike = { url?: string | null } | number | string | null | undefined;

function imageUrl(media: MediaLike): string {
  if (media && typeof media === "object" && "url" in media && media.url) return media.url;
  return "";
}

async function client() {
  return getPayload({ config });
}

export async function fetchProjects(): Promise<Project[]> {
  const payload = await client();

  const result = await payload.find({
    collection: "projects",
    where: { published: { equals: true } },
    sort: "number",
    locale: "all",
    depth: 2,
    limit: 100,
  });

  return result.docs.map((doc) => {
    const slidesFor = (language: "nl" | "en") =>
      ((doc.slides ?? []) as Row[]).map((slide) => ({
        layout: (slide.layout as SlideLayout) ?? "vol",
        img: imageUrl(slide.image as MediaLike),
        imgTwo: slide.imageTwo ? imageUrl(slide.imageTwo as MediaLike) : undefined,
        caption: pick(slide.caption as Localized<string>, language),
        sub: pick(slide.sub as Localized<string>, language),
        body: pick(slide.body as Localized<string>, language),
      }));

    const contentFor = (language: "nl" | "en") => ({
      category: pick(doc.category as Localized<string>, language),
      intro: pick(doc.intro as Localized<string>, language),
      materialQuote: pick(doc.materialQuote as Localized<string>, language),
      materialsLabel: language === "nl" ? "MATERIALEN" : "MATERIALS",
      materialsList: pick(doc.materialsList as Localized<string>, language),
      slides: slidesFor(language),
    });

    return {
      slug: doc.slug,
      title: pick(doc.title as Localized<string>, "nl"),
      number: doc.number,
      year: doc.year,
      cardImage: imageUrl(doc.cardImage as MediaLike),
      nl: contentFor("nl"),
      en: contentFor("en"),
    } satisfies Project;
  });
}

export async function fetchServices(): Promise<Record<string, Service>> {
  const payload = await client();

  const result = await payload.find({
    collection: "services",
    where: { published: { equals: true } },
    sort: "number",
    locale: "all",
    depth: 2,
    limit: 100,
  });

  const services: Record<string, Service> = {};

  for (const doc of result.docs) {
    const contentFor = (language: "nl" | "en") => ({
      name: pick(doc.name as Localized<string>, language),
      tagline: pick(doc.tagline as Localized<string>, language),
      price: pick(doc.price as Localized<string>, language),
      introOne: pick(doc.introOne as Localized<string>, language),
      introTwo: pick(doc.introTwo as Localized<string>, language) || undefined,
      reasons: ((doc.reasons ?? []) as Row[]).map((reason, index: number) => ({
        n: String(index + 1).padStart(2, "0"),
        text: pick(reason.text as Localized<string>, language),
      })),
      steps: ((doc.steps ?? []) as Row[]).map((step) => ({
        title: pick(step.title as Localized<string>, language),
        body: pick(step.body as Localized<string>, language),
        img: imageUrl(step.image as MediaLike),
      })),
      quote: pick(doc.quote as Localized<string>, language) || undefined,
      quoteAttr: pick(doc.quoteAttr as Localized<string>, language) || undefined,
    });

    services[doc.slug] = {
      number: doc.number,
      heroImage: imageUrl(doc.heroImage as MediaLike),
      cardImage: imageUrl(doc.cardImage as MediaLike),
      nl: contentFor("nl"),
      en: contentFor("en"),
    };
  }

  return services;
}

export async function fetchProducts(): Promise<Product[]> {
  const payload = await client();

  const result = await payload.find({
    collection: "products",
    where: { published: { equals: true } },
    locale: "all",
    depth: 2,
    limit: 200,
  });

  return result.docs.map((doc) => {
    const contentFor = (language: "nl" | "en") => ({
      name: pick(doc.name as Localized<string>, language),
      tagline: pick(doc.tagline as Localized<string>, language),
      description: pick(doc.description as Localized<string>, language),
      specs: ((doc.specs ?? []) as Row[]).map((spec) => ({
        label: pick(spec.label as Localized<string>, language),
        value: pick(spec.value as Localized<string>, language),
      })),
    });

    return {
      slug: doc.slug,
      category: doc.category as ProductCategory,
      priceCents: doc.priceCents,
      currency: "EUR" as const,
      stock: doc.stock ?? null,
      images: ((doc.images ?? []) as Row[]).map((entry) => imageUrl(entry.image as MediaLike)),
      nl: contentFor("nl"),
      en: contentFor("en"),
    } satisfies Product;
  });
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const payload = await client();

  const result = await payload.find({
    collection: "testimonials",
    where: { published: { equals: true } },
    sort: "order",
    locale: "all",
    depth: 0,
    limit: 50,
  });

  return result.docs.map((doc) => ({
    id: String(doc.id),
    nl: {
      quote: pick(doc.quote as Localized<string>, "nl"),
      attribution: pick(doc.attribution as Localized<string>, "nl"),
    },
    en: {
      quote: pick(doc.quote as Localized<string>, "en"),
      attribution: pick(doc.attribution as Localized<string>, "en"),
    },
  }));
}
