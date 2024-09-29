import type { Metadata } from "next";
import { Main } from "./_components/Main";
import { TimetableFilter } from "./_components/TimetableFilter";
import { fetchTimetable } from "./_lib/timetable";

type PageProps = {
  params: {
    name: string;
  };
};

export default function Page({ params }: PageProps) {
  const name = decodeURIComponent(params.name);

  return (
    <div>
      <TimetableFilter className="sticky top-0 mb-4" name={name} />
      <Main name={name} />
    </div>
  );
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const name = decodeURIComponent(params.name);
  const response = await fetchTimetable(name);

  return {
    title: `Timetable at ${response.name}`,
  };
};
