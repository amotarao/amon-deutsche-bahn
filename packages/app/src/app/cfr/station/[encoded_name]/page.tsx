import type { Metadata } from "next";

import { fetchApi } from "./_lib/api";
import { PageClient } from "./page-client";

type Props = {
  params: Promise<{
    encoded_name: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { encoded_name } = await params;
  const name = decodeURIComponent(encoded_name);
  return <PageClient name={name} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { encoded_name } = await params;
  const name = decodeURIComponent(encoded_name);
  const response = await fetchApi(name);

  return {
    title: `Timetable at ${response.name}`,
  };
}
