/*
 * De vorm van een klantcitaat. De inhoud komt uit de database; dit bestand
 * beschrijft alleen hoe zo'n citaat eruitziet en levert de beginwaarde waarmee
 * de collectie gevuld is.
 */
export interface Testimonial {
  id: string;
  nl: { quote: string; attribution: string };
  en: { quote: string; attribution: string };
}

/*
 * Het citaat dat tot nu toe hardgecodeerd op de homepage stond. Het komt uit
 * het ontwerp van Bas en is nooit bij een klant geverifieerd — daarom staat het
 * in de database op niet-zichtbaar tot iemand bevestigt dat het klopt.
 */
export const seedTestimonials: Array<{
  order: number;
  published: boolean;
  placeholder?: boolean;
  nl: { quote: string; attribution: string };
  en: { quote: string; attribution: string };
}> = [
  {
    order: 1,
    published: false,
    nl: {
      quote:
        "Bas heeft ons enorm geholpen om na jaren van proberen ons huis eindelijk tot een samenhangend geheel te maken. Hij vertaalde onze leefstijl, wensen en wat voor ons echt belangrijk is naar een huis dat precies weergeeft wie we zijn en hoe we leven.",
      attribution: "Sky Residence",
    },
    en: {
      quote:
        "Bas has been an incredible help in bringing our home together after years of struggling to create a cohesive whole. He translated our lifestyle, wishes and the things that matter most to us into a home that truly reflects who we are and how we live every day.",
      attribution: "Sky Residence",
    },
  },
];

/*
 * Verzonnen citaten om de reeks op staging te kunnen beoordelen. Ze staan in
 * het paneel gemarkeerd als voorbeeldtekst en moeten weg of vervangen zijn
 * voordat de site live gaat.
 */
export const placeholderTestimonials: typeof seedTestimonials = [
  {
    order: 2,
    published: true,
    placeholder: true,
    nl: {
      quote:
        "We wisten wat we mooi vonden maar niet hoe het samen moest komen. Bas zag dat binnen een middag, en wat hij voorstelde voelde meteen als van ons.",
      attribution: "Villa Oltera",
    },
    en: {
      quote:
        "We knew what we liked but not how it should come together. Bas saw that within an afternoon, and what he proposed felt like ours straight away.",
      attribution: "Villa Oltera",
    },
  },
  {
    order: 3,
    published: true,
    placeholder: true,
    nl: {
      quote:
        "Het verbouwen zelf hebben we nauwelijks gemerkt. Alles liep via hem, en op de dag van oplevering stond er een huis dat af was tot en met de laatste lamp.",
      attribution: "Residence Amsterdam",
    },
    en: {
      quote:
        "We hardly noticed the building work. Everything ran through him, and on handover day the house was finished down to the last lamp.",
      attribution: "Residence Amsterdam",
    },
  },
  {
    order: 4,
    published: true,
    placeholder: true,
    nl: {
      quote:
        "Wat ons het meest is bijgebleven is de rust. Niet één ruimte schreeuwt om aandacht, en toch klopt elk hoekje.",
      attribution: "Villa Nera",
    },
    en: {
      quote:
        "What stayed with us most is the calm. Not one room demands attention, and yet every corner is right.",
      attribution: "Villa Nera",
    },
  },
];
