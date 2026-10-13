"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * Traagheidsscroll over de hele site.
 *
 * Een muiswiel of trackpad verspringt per stapje; de pagina volgt die stapjes
 * één op één en dat voelt hard. Hier komt er een rem tussen: elke scroll zet
 * een doel, en de pagina loopt daar met afnemende snelheid naartoe. Je scrolt
 * evenveel, het komt alleen rustiger aan.
 *
 * Twee dingen moeten hierop aangesloten zijn, anders lopen ze achter:
 * - GSAP tekent normaal op zijn eigen ritme. Nu tekent het mee met Lenis,
 *   zodat vastgepinde secties en parallax in de pas blijven lopen.
 * - ScrollTrigger moet weten dat er gescrold is; de scroll komt immers niet
 *   meer van de browser zelf.
 *
 * Wie in zijn systeem heeft gezegd minder beweging te willen, krijgt gewoon de
 * scroll van de browser.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      /*
       * Hoe sterk de rem is. 0,1 is het vertrek van Lenis en voelt hier te
       * stroperig; 0,085 laat het iets langer doorlopen zonder dat je het
       * gevoel krijgt achter de pagina aan te zitten.
       */
      lerp: 0.085,
      /* Eén wielstap zet iets minder ver door dan de browser zelf zou doen. */
      wheelMultiplier: 0.9,
      /* Op een touchscreen is de scroll van het toestel zelf al goed. */
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tekenen = (tijd: number) => lenis.raf(tijd * 1000);
    gsap.ticker.add(tekenen);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tekenen);
      lenis.destroy();
    };
  }, []);

  return null;
}
