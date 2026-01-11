import type { Metadata } from "next";

import { fetchApi } from "./_lib/api";
import { PageClient } from "./page-client";

export default async function Page({
  params,
}: PageProps<"/cfr/station/[encoded_name]">) {
  const { encoded_name } = await params;
  const name = decodeURIComponent(encoded_name);
  return <PageClient name={name} />;
}

export async function generateMetadata({
  params,
}: PageProps<"/cfr/station/[encoded_name]">): Promise<Metadata> {
  const { encoded_name } = await params;
  const name = decodeURIComponent(encoded_name);
  const response = await fetchApi(name);

  return {
    title: `Timetable at ${response.name}`,
  };
}
