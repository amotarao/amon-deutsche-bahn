import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
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
        const queryDate = [query.date.slice(8, 10), query.date.slice(5, 7), query.date.slice(0, 4)].join('.');

        const url = new URL(`${location.origin}/api/traininfo/${path}`);
        url.searchParams.set('date', queryDate);

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

      {isFetching && <p>Fetching</p>}

      {data && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 p-2">
            <p className="text-xs font-bold">{data.data.train}</p>
            <p className="text-xs">{data.data.validFrom}</p>
          </div>
          <div className="flex flex-col">
            {data.data.route.map((station, i) => {
              return (
                <div className="flex flex-wrap gap-2 border-b border-dashed border-gray-300 p-2 text-xs" key={i}>
                  <p className="grow-1 w-48">
                    <Link
                      href={`/timetable/stations/${station.name}?type=dep&date=${query.date}&time=${encodeURIComponent(
                        station.arrivalActualTime ||
                          station.arrivalTime ||
                          station.departureActualTime ||
                          station.departureTime ||
                          ''
                      )}`}
                    >
                      <a
                        className={
                          station.information.noStop || station.information.extraStop
                            ? 'font-bold text-red-500 underline'
                            : 'underline'
                        }
                      >
                        {station.name}
                      </a>
                    </Link>
                    <br />
                    {station.information.noStop && <span className="font-bold text-red-500">No Stop</span>}
                    {station.information.extraStop && <span className="font-bold text-red-500">Extra Stop</span>}
                  </p>
                  <p className="w-12 text-right">
                    <span className={station.information.noStop ? 'font-bold text-red-500 line-through' : ''}>
                      {station.arrivalTime}
                    </span>
                    <br />
                    {station.arrivalActualTime && station.arrivalTime !== station.arrivalActualTime && (
                      <span className={station.arrivalDelayed ? 'text-red-500' : ''}>
                        &gt;{station.arrivalActualTime}
                      </span>
                    )}
                  </p>
                  <p className="w-12 text-right">
                    <span className={station.information.noStop ? 'font-bold text-red-500 line-through' : ''}>
                      {station.departureTime}
                    </span>
                    <br />
                    {station.departureActualTime && station.departureTime !== station.departureActualTime && (
                      <span className={station.departureDelayed ? 'text-red-500' : ''}>
                        &gt;{station.departureActualTime}
                      </span>
                    )}
                  </p>
                  <p className="w-10 text-right">
                    <span className={station.information.changedPlatform ? 'font-bold text-red-500' : ''}>
                      {station.platform}
                    </span>
                  </p>
                  {station.information.message.length > 0 && (
                    <div className="w-full">
                      {station.information.message.map((message, i) => {
                        return <p key={i}>* {message}</p>;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
