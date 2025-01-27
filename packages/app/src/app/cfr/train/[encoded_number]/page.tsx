import type { Metadata } from "next";
import { fetchApi } from "./_lib/api";
import { PageClient } from "./page-client";

type Props = {
  params: Promise<{
    encoded_number: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { encoded_number } = await params;
  const number = decodeURIComponent(encoded_number);
  return <PageClient number={number} />;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { encoded_number } = await params;
  const number = decodeURIComponent(encoded_number);
  const response = await fetchApi(number);

  return {
    title: `Train ${response.name}`,
  };
};
