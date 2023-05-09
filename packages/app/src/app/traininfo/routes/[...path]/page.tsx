import type { Metadata } from 'next';
import { RouteStationCard } from '../../../../components/traininfo/RouteStationCard';
import { TraininfoResponse } from '../../../../utils/api/traininfo/types';

type PageProps = {
  params: {
    path: string[];
  };
  searchParams: {
    [key: string]: string;
  };
};

type Data = {
  data: TraininfoResponse;
};

const getData = async ({ params, searchParams }: PageProps): Promise<Data> => {
  const path = (params?.path ?? []).join('/');

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/traininfo/${path}`);
  'date' in searchParams && typeof searchParams.date === 'string' && url.searchParams.set('date', searchParams.date);

  const res = await fetch(url, { next: { revalidate: 60 } });
  const data = (await res.json()) as TraininfoResponse;

  return {
    data,
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const { data } = await getData({ params, searchParams });

  return (
    <div>
      {data && (
        <div className="flex flex-col gap-2">
          <div className="px-4 py-2">
            <p className="text-sm font-bold">{data.data.train}</p>
            <p className="text-xs">{data.data.validFrom}</p>
          </div>
          <div className="flex flex-col">
            {data.data.route.map((station) => (
              <RouteStationCard
                className="border-b border-dashed border-gray-300"
                station={station}
                key={station.detailHref}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2 px-4 py-2">
            <div>
              {data.data.information.map((info, i) => (
                <p className="text-xs" key={i}>
                  {info}
                </p>
              ))}
            </div>
            {data.data.remark.map((r, i) => (
              <div key={i}>
                <p className="text-xs font-bold">{r.title}</p>
                <p className="text-xs">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const { data } = await getData({ params, searchParams });

  return {
    title: `Train Info at ${data?.data.train ?? ''}`,
  };
};
