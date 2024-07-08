import type { Metadata } from "next";
import { Main } from "../../_components/Main";
import { TimetableFilter } from "../../_components/TimetableFilter";

type PageProps = {
  params: {
    name: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <div>
      <TimetableFilter className="sticky top-0 mb-4" name={params.name} />
      <Main name={params.name} />
    </div>
  );
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  return {
    title: `Timetable at ${params.name}`,
  };

  // 余計にリクエストするため、一旦コメントアウト
  // const response = await fetchTimetable(params.name, { id: searchParams.id }, { next: { revalidate: 60 * 60 } });

  // return {
  //   title: `Timetable at ${response.data.name}`,
  // };
};
