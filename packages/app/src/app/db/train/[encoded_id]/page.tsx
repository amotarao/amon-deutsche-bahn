import type { Metadata } from "next";

import { PageClient } from "./page-client";

type Params = {
  encoded_id: string;
};

type Props = {
  params: Promise<Params>;
};

export default async function Page({ params }: Props) {
  const { encoded_id } = await params;
  const id = decodeURIComponent(encoded_id);
  return <PageClient id={id} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { encoded_id } = await params;
  const id = decodeURIComponent(encoded_id);
  return {
    title: `Train Info of ${id}`,
  };
}
