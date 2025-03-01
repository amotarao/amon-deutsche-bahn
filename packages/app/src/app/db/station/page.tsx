import type { Metadata } from "next";
import { PageClient } from "./[encoded_name]/page-client";

type Props = {
  params: Promise<Record<string, never>>;
};

export default async function Page({ params }: Props) {
  await params;
  return <PageClient name={undefined} />;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  await params;
  return {
    title: "Timetable",
  };
};
