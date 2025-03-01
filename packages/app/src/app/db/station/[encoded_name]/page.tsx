import type { Metadata } from "next";
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

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { encoded_name } = await params;
  const name = decodeURIComponent(encoded_name);
  return {
    title: `Timetable of ${name}`,
  };
};
