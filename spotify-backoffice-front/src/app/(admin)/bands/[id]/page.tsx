"use client";

import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const showTitle = searchParams.get("showTitle");
  const anotherParam = searchParams.get("anotherParam"); //null
  return (
    <>
      <h1>Banda ID: {params.id}</h1>
      <h2>Mode: {mode}</h2>
      <h2>showTitle: {showTitle}</h2>
      <h2>anotherParam: {anotherParam}</h2>
    </>
  );
}
