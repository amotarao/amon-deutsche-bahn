import type { Metadata } from "next";

import { PageClient } from "./page-client";

export default async function Page({
  params,
}: PageProps<"/db/station/[encoded_name]">) {
  const { encoded_name } = await params;
  const name = decodeURIComponent(encoded_name);
  return <PageClient name={name} />;
}

export async function generateMetadata({
  params,
}: PageProps<"/db/station/[encoded_name]">): Promise<Metadata> {
  const { encoded_name } = await params;
  const name = decodeURIComponent(encoded_name);
  return {
    title: `Timetable of ${name}`,
  };
}
