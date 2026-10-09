import type { Language } from "./i18n";

export interface ServiceStep {
  title: string;
  body: string;
  img: string;
}

export interface ServiceReason {
  n: string;
  text: string;
}

export interface ServiceContent {
  name: string;
  tagline: string;
  price: string;
  priceUnit: string;
  introOne: string;
  introTwo: string;
  reasons: ServiceReason[];
  steps: ServiceStep[];
  quote: string;
  quoteAttr: string;
}

export interface Service {
  number: string;
  heroImage: string;
  cardImage: string;
  en: ServiceContent;
  nl: ServiceContent;
}

/*
 * De drie studio services, één op één overgenomen uit Bas zijn ontwerp.
 * De sleutel is de slug in de URL: /services/style-consult.
 */
export const services: Record<string, Service> = {
  "style-consult": {
    "number": "01",
    "heroImage": "/images/design/svc-style-consult-hero.jpg",
    "cardImage": "/images/design/service-style-consult.jpg",
    "en": {
      "name": "Style Consult",
      "tagline": "A clear direction for your space, in one afternoon.",
      "price": "From €450",
      "priceUnit": "PER ROOM",
      "introOne": "Not every project needs a full renovation. Sometimes all it takes is an outside eye — someone who sees what's already there, and shows you how to bring it together.",
      "introTwo": "Style Consult is a focused, in-home session that turns a room you can't quite place into a room you understand — and a clear plan for what to do next.",
      "reasons": [
        {
          "n": "01",
          "text": "A fresh, expert perspective on a space you know too well to see clearly"
        },
        {
          "n": "02",
          "text": "Practical direction you can act on immediately"
        },
        {
          "n": "03",
          "text": "No commitment beyond a single afternoon"
        },
        {
          "n": "04",
          "text": "The natural first step before a larger project"
        }
      ],
      "steps": [
        {
          "title": "Introduction",
          "body": "We start with a conversation in your home — how you live, what already works, and what still feels unresolved.",
          "img": "/images/design/svc-step-livingroom.jpg"
        },
        {
          "title": "On-site advice",
          "body": "Walking through the space together, we translate first impressions into concrete direction: colour, material, layout.",
          "img": "/images/design/svc-step-shelf-sofa.jpg"
        },
        {
          "title": "Style document",
          "body": "You receive a short, visual document capturing the direction — palette, materials, and a few key pieces to guide you.",
          "img": "/images/design/svc-step-cabinet-doors.jpg"
        },
        {
          "title": "Your next move",
          "body": "Whether you continue on your own or move into a full design, you leave with clarity and confidence.",
          "img": "/images/design/svc-step-mirror-room.jpg"
        }
      ],
      "quote": "\"Bas walked through our living room and within an hour, everything just clicked.\"",
      "quoteAttr": "STYLE CONSULT CLIENT"
    },
    "nl": {
      "name": "Style Consult",
      "tagline": "Heldere richting voor uw ruimte, in één middag.",
      "price": "Vanaf €450",
      "priceUnit": "PER RUIMTE",
      "introOne": "Niet elk project vraagt om een complete verbouwing. Soms is alleen een frisse blik nodig — iemand die ziet wat er al is, en laat zien hoe het samenkomt.",
      "introTwo": "Style Consult is een gericht adviesgesprek aan huis dat een ruimte waar u niet helemaal de vinger op kunt leggen, verandert in een ruimte die u begrijpt — met een concreet plan voor de volgende stap.",
      "reasons": [
        {
          "n": "01",
          "text": "Een frisse, deskundige blik op een ruimte die u te goed kent om nog scherp te zien"
        },
        {
          "n": "02",
          "text": "Praktische richting waarmee u direct aan de slag kunt"
        },
        {
          "n": "03",
          "text": "Geen verplichting voorbij één middag"
        },
        {
          "n": "04",
          "text": "De logische eerste stap vóór een groter project"
        }
      ],
      "steps": [
        {
          "title": "Kennismaking",
          "body": "We beginnen met een gesprek bij u thuis — over hoe u leeft, wat al werkt, en wat nog niet helemaal klopt.",
          "img": "/images/design/svc-step-livingroom.jpg"
        },
        {
          "title": "Advies op locatie",
          "body": "Wandelend door de ruimte vertalen we eerste indrukken naar concrete richting: kleur, materiaal, indeling.",
          "img": "/images/design/svc-step-shelf-sofa.jpg"
        },
        {
          "title": "Stijldocument",
          "body": "U ontvangt een kort, visueel document met de richting — palet, materialen en een paar sleutelstukken.",
          "img": "/images/design/svc-step-cabinet-doors.jpg"
        },
        {
          "title": "Uw volgende stap",
          "body": "Of u nu zelf verder gaat of doorstroomt naar een volledig ontwerp: u vertrekt met duidelijkheid en vertrouwen.",
          "img": "/images/design/svc-step-mirror-room.jpg"
        }
      ],
      "quote": "\"Bas liep onze woonkamer door en binnen een uur viel alles op zijn plek.\"",
      "quoteAttr": "KLANT STYLE CONSULT"
    }
  },
  "signature-ontwerp": {
    "number": "02",
    "heroImage": "/images/design/svc-signature-design-hero.jpg",
    "cardImage": "/images/design/service-signature-design.jpg",
    "en": {
      "name": "Signature Design",
      "tagline": "A complete interior, designed entirely around you.",
      "price": "From €2,500",
      "priceUnit": "PER ROOM",
      "introOne": "For those ready to fully commit to their space — Signature Design takes your rooms from concept to a complete, cohesive plan, ready for realization.",
      "introTwo": "Every decision — layout, light, material, furniture — is considered together, so nothing is left to chance and nothing feels disconnected.",
      "reasons": [
        {
          "n": "01",
          "text": "Every detail considered before a single order is placed"
        },
        {
          "n": "02",
          "text": "A 3D visualisation so you never have to imagine — you see it"
        },
        {
          "n": "03",
          "text": "One cohesive plan instead of piecemeal decisions"
        },
        {
          "n": "04",
          "text": "Full support in sourcing exactly what's specified"
        }
      ],
      "steps": [
        {
          "title": "Introduction",
          "body": "A personal conversation about your lifestyle, ambitions and how you want the whole home to feel.",
          "img": "/images/design/svc-step-livingroom.jpg"
        },
        {
          "title": "Concept & floor plan",
          "body": "We shape the spatial concept: layout, lighting plan, and the atmosphere that will carry through every room.",
          "img": "/images/design/svc-step-cabinet-doors.jpg"
        },
        {
          "title": "Material & furniture plan",
          "body": "A full material and furniture plan, brought to life in a 3D visualisation — so you see the space before it exists.",
          "img": "/images/design/svc-step-mirror-room.jpg"
        },
        {
          "title": "Your personal shopping list",
          "body": "Every piece specified and sourced, ready to order — the plan translated into a concrete list.",
          "img": "/images/design/svc-step-shelf-detail.jpg"
        }
      ],
      "quote": "\"We could finally see our home before it existed — every decision felt certain.\"",
      "quoteAttr": "SIGNATURE DESIGN CLIENT"
    },
    "nl": {
      "name": "Signature Ontwerp",
      "tagline": "Een compleet interieur, volledig rond u ontworpen.",
      "price": "Vanaf €2.500",
      "priceUnit": "PER RUIMTE",
      "introOne": "Voor wie klaar is om volledig voor de ruimte te gaan — Signature Ontwerp brengt uw kamers van concept naar een compleet, samenhangend plan, klaar voor realisatie.",
      "introTwo": "Iedere keuze — indeling, licht, materiaal, meubilair — wordt in samenhang bekeken, zodat niets aan het toeval wordt overgelaten en niets los voelt van de rest.",
      "reasons": [
        {
          "n": "01",
          "text": "Elk detail doordacht vóór er ook maar iets besteld wordt"
        },
        {
          "n": "02",
          "text": "Een 3D-visualisatie zodat u nooit hoeft te fantaseren — u ziet het"
        },
        {
          "n": "03",
          "text": "Één samenhangend plan in plaats van losse beslissingen"
        },
        {
          "n": "04",
          "text": "Volledige begeleiding bij het inkopen van precies wat er is gespecificeerd"
        }
      ],
      "steps": [
        {
          "title": "Kennismaking",
          "body": "Een persoonlijk gesprek over uw leefstijl, ambities en hoe het hele huis moet aanvoelen.",
          "img": "/images/design/svc-step-livingroom.jpg"
        },
        {
          "title": "Concept & plattegrond",
          "body": "We vormen het ruimtelijk concept: indeling, lichtplan en de sfeer die door elke kamer doorloopt.",
          "img": "/images/design/svc-step-cabinet-doors.jpg"
        },
        {
          "title": "Materiaal- en meubelplan",
          "body": "Een volledig materiaal- en meubelplan, tot leven gebracht in een 3D-visualisatie — zodat u de ruimte ziet vóór hij bestaat.",
          "img": "/images/design/svc-step-mirror-room.jpg"
        },
        {
          "title": "Uw persoonlijke shoppinglist",
          "body": "Ieder stuk gespecificeerd en ingekocht, klaar om te bestellen — het plan vertaald naar een concrete lijst.",
          "img": "/images/design/svc-step-shelf-detail.jpg"
        }
      ],
      "quote": "\"We konden ons huis eindelijk zien vóórdat het bestond — elke keuze voelde zeker.\"",
      "quoteAttr": "KLANT SIGNATURE ONTWERP"
    }
  },
  "home-couture": {
    "number": "03",
    "heroImage": "/images/design/svc-home-couture-hero.jpg",
    "cardImage": "/images/design/service-home-couture.jpg",
    "en": {
      "name": "Home Couture",
      "tagline": "From the first sketch to the last cushion — fully taken care of.",
      "price": "By quote",
      "priceUnit": "FULL PROJECT",
      "introOne": "Home Couture is our most complete service: we don't just design your home, we deliver it. Every contractor, every delivery, every final styling touch — coordinated by us, for you.",
      "introTwo": "A single point of contact, from the first sketch to the day you walk into a finished home.",
      "reasons": [
        {
          "n": "01",
          "text": "A single point of contact for your entire project"
        },
        {
          "n": "02",
          "text": "Contractors and suppliers coordinated on your behalf"
        },
        {
          "n": "03",
          "text": "Nothing left unfinished — down to the final styling"
        },
        {
          "n": "04",
          "text": "The peace of mind of full-service delivery"
        }
      ],
      "steps": [
        {
          "title": "Introduction",
          "body": "We start where every project starts — understanding how you live, and what a finished home should feel like.",
          "img": "/images/design/svc-step-livingroom.jpg"
        },
        {
          "title": "Concept & design",
          "body": "A complete design is developed for every room, with the same care as Signature Design — but this is only the beginning.",
          "img": "/images/design/svc-step-cabinet-doors.jpg"
        },
        {
          "title": "Coordination & realization",
          "body": "We coordinate contractors, suppliers and deliveries — so you never have to manage a single one yourself.",
          "img": "/images/design/svc-step-mirror-room.jpg"
        },
        {
          "title": "Final styling",
          "body": "The last layer — down to the cushions on the sofa — styled by us, so you simply move in.",
          "img": "/images/design/svc-step-shelf-detail.jpg"
        }
      ],
      "quote": "\"We didn't manage a single contractor ourselves. We just moved in.\"",
      "quoteAttr": "HOME COUTURE CLIENT"
    },
    "nl": {
      "name": "Home Couture",
      "tagline": "Van eerste schets tot laatste kussen — volledig ontzorgd.",
      "price": "Op offerte",
      "priceUnit": "VOLLEDIG TRAJECT",
      "introOne": "Home Couture is onze meest complete service: wij ontwerpen uw huis niet alleen, wij leveren het ook op. Elke aannemer, elke levering, elke laatste stylingtouch — door ons gecoördineerd, voor u.",
      "introTwo": "Één aanspreekpunt, van de eerste schets tot de dag dat u een afgewerkt huis binnenloopt.",
      "reasons": [
        {
          "n": "01",
          "text": "Één vast aanspreekpunt voor het hele project"
        },
        {
          "n": "02",
          "text": "Aannemers en leveranciers namens u gecoördineerd"
        },
        {
          "n": "03",
          "text": "Niets blijft onafgewerkt — tot en met de laatste styling"
        },
        {
          "n": "04",
          "text": "De rust van een volledig ontzorgd traject"
        }
      ],
      "steps": [
        {
          "title": "Kennismaking",
          "body": "We beginnen waar elk project begint — begrijpen hoe u leeft, en hoe een afgewerkt huis moet aanvoelen.",
          "img": "/images/design/svc-step-livingroom.jpg"
        },
        {
          "title": "Concept & ontwerp",
          "body": "Voor elke ruimte wordt een compleet ontwerp uitgewerkt, met dezelfde zorg als Signature Ontwerp — maar dit is nog maar het begin.",
          "img": "/images/design/svc-step-cabinet-doors.jpg"
        },
        {
          "title": "Coördinatie & realisatie",
          "body": "Wij coördineren aannemers, leveranciers en leveringen — zodat u er zelf nooit één hoeft te beheren.",
          "img": "/images/design/svc-step-mirror-room.jpg"
        },
        {
          "title": "Eindstyling",
          "body": "De laatste laag — tot en met de kussens op de bank — door ons gestyled, zodat u simpelweg kunt verhuizen.",
          "img": "/images/design/svc-step-shelf-detail.jpg"
        }
      ],
      "quote": "\"We hebben zelf geen enkele aannemer aangestuurd. We zijn gewoon verhuisd.\"",
      "quoteAttr": "KLANT HOME COUTURE"
    }
  }
};

export const serviceSlugs = Object.keys(services);

export function getService(slug: string): Service | undefined {
  return services[slug];
}

export function serviceContent(service: Service, language: Language): ServiceContent {
  return service[language];
}
