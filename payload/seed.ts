import path from "path";
import { fileURLToPath } from "url";

import type { Payload } from "payload";

import { projects as fileProjects } from "../app/content/projects";
import { services as fileServices } from "../app/content/services";
import { products as fileProducts } from "../app/content/products";

/*
 * Zet de content die tot nu toe in app/content/ stond in de database.
 *
 * Eenmalig gedraaid om de bestaande content in de database te zetten. Blijft
 * staan als naslag en om een lege database opnieuw te kunnen vullen; roep
 * runSeed() aan vanuit een tijdelijke route of een eigen script.
 *
 * Het script is herhaalbaar: bestaat een project of product al onder dezelfde
 * slug, dan wordt het overgeslagen in plaats van gedupliceerd. Zo kun je het
 * nog eens draaien zonder de boel te vervuilen.
 */

const dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dirname, "../public");

let payload: Payload;

/** Beelden worden op pad geüpload; eenmaal geüpload hergebruiken we het id. */
const uploaded = new Map<string, number | string>();

async function uploadImage(webPath: string, alt: string) {
  const existing = uploaded.get(webPath);
  if (existing) return existing;

  const filePath = path.join(publicDir, webPath.replace(/^\//, ""));

  const media = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
  });

  uploaded.set(webPath, media.id);
  return media.id;
}

async function alreadyThere(collection: "projects" | "services" | "products", slug: string) {
  const found = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    locale: "nl",
  });
  return found.docs.length > 0;
}

/*
 * Een document met twee talen vraagt twee schrijfacties: Payload schrijft per
 * keer naar één locale. Eerst het Nederlands aanmaken, daarna het Engels
 * erover.
 */
async function createBilingual(
  collection: "projects" | "services" | "products",
  shared: Record<string, unknown>,
  nl: Record<string, unknown>,
  en: Record<string, unknown>,
) {
  const created = await payload.create({
    collection,
    data: { ...shared, ...nl } as never,
    locale: "nl",
  });

  await payload.update({
    collection,
    id: created.id,
    data: en as never,
    locale: "en",
  });

  return created;
}

async function seedProjects() {
  for (const project of fileProjects) {
    if (await alreadyThere("projects", project.slug)) {
      payload.logger.info(`project ${project.slug} bestaat al — overgeslagen`);
      continue;
    }

    const cardImage = await uploadImage(project.cardImage, project.title);

    const slidesFor = async (language: "nl" | "en") =>
      Promise.all(
        project[language].slides.map(async (slide) => ({
          image: await uploadImage(slide.img, slide.caption || project.title),
          caption: slide.caption || undefined,
          sub: slide.sub || undefined,
          body: slide.body || undefined,
        })),
      );

    await createBilingual(
      "projects",
      {
        slug: project.slug,
        number: project.number,
        year: project.year,
        cardImage,
        published: true,
      },
      {
        title: project.title,
        category: project.nl.category,
        intro: project.nl.intro,
        materialQuote: project.nl.materialQuote,
        materialsList: project.nl.materialsList,
        slides: await slidesFor("nl"),
      },
      {
        title: project.title,
        category: project.en.category,
        intro: project.en.intro,
        materialQuote: project.en.materialQuote,
        materialsList: project.en.materialsList,
        slides: await slidesFor("en"),
      },
    );

    payload.logger.info(`project ${project.slug} toegevoegd`);
  }
}

async function seedServices() {
  for (const [slug, service] of Object.entries(fileServices)) {
    if (await alreadyThere("services", slug)) {
      payload.logger.info(`service ${slug} bestaat al — overgeslagen`);
      continue;
    }

    const cardImage = await uploadImage(service.cardImage, service.nl.name);
    const heroImage = await uploadImage(service.heroImage, service.nl.name);

    await createBilingual(
      "services",
      { slug, number: service.number, cardImage, heroImage, published: true },
      {
        name: service.nl.name,
        tagline: service.nl.tagline,
        price: service.nl.price,
        introOne: service.nl.introOne,
        introTwo: service.nl.introTwo,
      },
      {
        name: service.en.name,
        tagline: service.en.tagline,
        price: service.en.price,
        introOne: service.en.introOne,
        introTwo: service.en.introTwo,
      },
    );

    payload.logger.info(`service ${slug} toegevoegd`);
  }
}

async function seedProducts() {
  for (const product of fileProducts) {
    if (await alreadyThere("products", product.slug)) {
      payload.logger.info(`product ${product.slug} bestaat al — overgeslagen`);
      continue;
    }

    const images = await Promise.all(
      product.images.map(async (src) => ({ image: await uploadImage(src, product.nl.name) })),
    );

    await createBilingual(
      "products",
      {
        slug: product.slug,
        category: product.category,
        priceCents: product.priceCents,
        stock: product.stock ?? undefined,
        images,
        published: true,
      },
      {
        name: product.nl.name,
        tagline: product.nl.tagline,
        description: product.nl.description,
        specs: product.nl.specs,
      },
      {
        name: product.en.name,
        tagline: product.en.tagline,
        description: product.en.description,
        specs: product.en.specs,
      },
    );

    payload.logger.info(`product ${product.slug} toegevoegd`);
  }
}

export async function runSeed(client: Payload) {
  payload = client;

  await seedProjects();
  await seedServices();
  await seedProducts();

  return { ok: true };
}
