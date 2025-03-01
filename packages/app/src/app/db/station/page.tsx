import type { Metadata } from "next";
import PageClient from "./[encoded_name]/page-client";

export default async function Page() {
  return <PageClient name={undefined} />;
}

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Timetable",
  };
};
