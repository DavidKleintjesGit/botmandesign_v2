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
export const seedTestimonials = [
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
