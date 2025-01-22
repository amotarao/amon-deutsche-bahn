import type { Metadata } from "next";
import { RouteStationCard } from "./_components/RouteStationCard";
import PageClient from "./page-client";

type Props = {
  params: Promise<{
    encoded_id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { encoded_id } = await params;
  const id = decodeURIComponent(encoded_id);
  return <PageClient id={id} />;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { encoded_id } = await params;
  const id = decodeURIComponent(encoded_id);
  return {
    title: `Train Info of ${id}`,
  };
};
