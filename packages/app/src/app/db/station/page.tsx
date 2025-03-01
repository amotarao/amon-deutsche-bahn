import type { Metadata } from "next";
import PageClient from "./[encoded_name]/page-client";

export default function Page() {
  return <PageClient name={undefined} />;
}

export const generateMetadata = (): Metadata => {
  return {
    title: "Timetable",
  };
};
