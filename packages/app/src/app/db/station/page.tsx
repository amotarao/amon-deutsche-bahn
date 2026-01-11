import type { Metadata } from "next";

import { Suspense } from "react";

import { PageClient } from "./[encoded_name]/page-client";

export default function Page() {
  return (
    <Suspense>
      <PageClient name={undefined} />
    </Suspense>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Timetable",
  };
}
