import type { Metadata } from "next";

import { Suspense } from "react";

import { PageClient } from "./page-client";

export default function Page() {
  return (
    <Suspense>
      <PageClient />
    </Suspense>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: "Station",
  };
}
