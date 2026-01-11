import type { Metadata } from "next";

import { PageClient } from "./page-client";

export default async function Page({
  params,
}: PageProps<"/db/train/[encoded_id]">) {
  const { encoded_id } = await params;
  const id = decodeURIComponent(encoded_id);
  return <PageClient id={id} />;
}

export async function generateMetadata({
  params,
}: PageProps<"/db/train/[encoded_id]">): Promise<Metadata> {
  const { encoded_id } = await params;
  const id = decodeURIComponent(encoded_id);
  return {
    title: `Train Info of ${id}`,
  };
}
