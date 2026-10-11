"use client";

import Link from "next/link";
import { FormSubmit, useDocumentInfo, useForm } from "@payloadcms/ui";

/*
 * De twee knoppen rechtsboven: Terug en Opslaan.
 *
 * Payload heeft hier alleen Opslaan staan. Terug hoort in het ontwerp
 * ernaast, en omdat er geen plek is om een losse knop aan te hangen vervangt
 * dit de knop die er stond en zet de twee samen neer.
 *
 * Het opslaan zelf blijft van Payload: FormSubmit weet van validatie, van
 * bezig-zijn en van wat er daarna moet gebeuren.
 */
export default function SaveBar() {
  const { collectionSlug } = useDocumentInfo();
  const { submit } = useForm();

  return (
    <div className="bd-savebar">
      <Link href={`/admin/collections/${collectionSlug}`} className="bd-savebar__back">
        Terug
      </Link>

      <FormSubmit onClick={() => submit()} size="medium" type="button">
        Opslaan
      </FormSubmit>
    </div>
  );
}
