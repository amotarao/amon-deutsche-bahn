import type { Metadata } from "next";
import { Main } from "../../components/stations/Main";

export default function Page() {
  return <Main />;
}

export const metadata: Metadata = {
  title: "Stations",
};
