import type { Metadata } from "next";

import { fetchApi } from "./_lib/api";
import { PageClient } from "./page-client";

export default async function Page({
  params,
}: PageProps<"/cfr/train/[encoded_number]">) {
  const { encoded_number } = await params;
  const number = decodeURIComponent(encoded_number);
  return <PageClient number={number} />;
}

export async function generateMetadata({
  params,
}: PageProps<"/cfr/train/[encoded_number]">): Promise<Metadata> {
  const { encoded_number } = await params;
  const number = decodeURIComponent(encoded_number);
  const response = await fetchApi(number);

  return {
    title: `Train ${response.name}`,
  };
}
