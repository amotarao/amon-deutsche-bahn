import type { Metadata } from "next";
import { fetchApi } from "./_lib/api";
import { PageClient } from "./page-client";

export type PageProps = {
  params: {
    number: string;
  };
};

export default function Page(context: PageProps) {
  return <PageClient {...context} />;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const number = decodeURIComponent(params.number);
  const response = await fetchApi(number);

  return {
    title: `Train ${response.name}`,
  };
};
