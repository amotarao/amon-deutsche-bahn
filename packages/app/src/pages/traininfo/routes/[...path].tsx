import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { RouteStationCard } from '../../../components/traininfo/RouteStationCard';
import { TraininfoResponse } from '../../../utils/api/traininfo/types';

type Props = {
  path: string;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = (context) => {
  return {
    props: {
      path: ((context.params?.path as string[]) ?? []).join('/'),
    },
  };
};

type RequestQuery = {
  path: string;
  date: string;
};

const Page: NextPage<Props> = ({ path }) => {
  const router = useRouter();

  // request ready
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<TraininfoResponse | null>(null);
  const fetchTraininfo = useCallback(
    (query: RequestQuery) => {
      (async () => {
        setIsFetching(true);

        const url = new URL(`${location.origin}/api/traininfo/${path}`);
        url.searchParams.set('date', query.date);

        const res = await fetch(url);
        const json = (await res.json()) as TraininfoResponse;

        setData(json);
        setIsFetching(false);
      })();
    },
    [path]
  );

  // initialize query
  const [isReady, setIsReady] = useState(false);
  const [query, setQuery] = useState<RequestQuery>({
    path: '',
    date: '',
  });
  useEffect(() => {
    if (!router.isReady || isReady) {
      return;
    }
    setQuery(() => ({
      path,
      date: (router.query.date as string) || new Date().toISOString().slice(0, 10),
    }));
    setIsReady(true);
  }, [path, router.isReady, router.query, isReady]);

  // fetch
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const query: RequestQuery = {
      path,
      date: (router.query.date as string) || new Date().toISOString().slice(0, 10),
    };
    fetchTraininfo(query);
  }, [path, router.isReady, router.query, fetchTraininfo]);

  return (
    <div>
      <Head>
        <title>Train Info at {data?.data.train ?? ''}</title>
      </Head>

      {isFetching && <p className="px-2 py-1 text-sm">Fetching</p>}

      {data && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 p-2">
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
          <div className="flex flex-col gap-2 p-2">
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
