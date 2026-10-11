"use client";

import { useDocumentInfo } from "@payloadcms/ui";

/*
 * De bovenregel boven de titel van een document: "Klantcitaat" bij een
 * bestaand document, "Nieuw citaat" bij een nieuw.
 *
 * Payload zet hier normaal de omschrijving van de collectie neer. Die staat in
 * ons ontwerp op de lijstpagina, niet hier; hier hoort kort te staan wát je
 * voor je hebt.
 */
export default function EditKicker({ singular, nieuw }: { singular: string; nieuw: string }) {
  const { id } = useDocumentInfo();

  return <div className="custom-view-description">{id ? singular : nieuw}</div>;
}
