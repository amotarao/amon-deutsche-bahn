import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { RouteStationCard } from '../../../components/traininfo/RouteStationCard';
import { TraininfoResponse } from '../../../utils/api/traininfo/types';

type Params = {
  path: string[];
};

type Props = {
  data: TraininfoResponse;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ params, query, req }) => {
  const path = (params?.path ?? []).join('/');

  const url = new URL(
    `${
      new URL(`${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`).origin
    }/api/traininfo/${path}`
  );
  'date' in query && typeof query.date === 'string' && url.searchParams.set('date', query.date);

  const res = await fetch(url);
  const data = (await res.json()) as TraininfoResponse;

  return {
    props: {
      data,
    },
  };
};

const Page: NextPage<Props> = ({ data }) => {
  return (
    <div>
      <Head>
        <title>Train Info at {data?.data.train ?? ''}</title>
      </Head>
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
};

export default Page;
