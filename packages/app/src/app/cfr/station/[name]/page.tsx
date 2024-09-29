import type { Metadata } from "next";
import { fetchApi } from "./_lib/api";
import { PageClient } from "./page-client";

export type PageProps = {
  params: {
    name: string;
  };
};

export default function Page(context: PageProps) {
  return <PageClient {...context} />;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const name = decodeURIComponent(params.name);
  const response = await fetchApi(name);

  return {
    title: `Timetable at ${response.name}`,
  };
};
