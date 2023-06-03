import { Metadata } from 'next';
import { Suspense } from 'react';
import { Main } from '../../../../components/timetable/Main';
import { TimetableFilter } from '../../../../components/timetable/TimetableFilter';

type PageProps = {
  params: {
    name: string;
  };
  searchParams: {
    [key: string]: string;
  };
};

export default function Page({ params, searchParams }: PageProps) {
  return (
    <div>
      <TimetableFilter className="sticky top-0 mb-4" name={params.name} />
      <Suspense fallback={<p className="px-4 py-2 text-sm">Fetching</p>}>
        {/* @ts-expect-error Async Server Component */}
        <Main name={params.name} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  return {
    title: `Timetable at ${params.name}`,
  };

  // 余計にリクエストするため、一旦コメントアウト
  // const response = await fetchTimetable(params.name, { id: searchParams.id }, { next: { revalidate: 60 * 60 } });

  // return {
  //   title: `Timetable at ${response.data.name}`,
  // };
};
