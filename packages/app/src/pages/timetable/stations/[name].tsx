import debounce from 'lodash.debounce';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { TimetableResponse } from '../../../utils/api/timetable/types';

type Props = {
  name: string;
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
      name: (context.params?.name as string) ?? '',
    },
  };
};

type RequestQuery = {
  name: string;
  type: string;
  date: string;
  time: string;
};

const Page: NextPage<Props> = ({ name }) => {
  const router = useRouter();

  // request ready
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<TimetableResponse | null>(null);
  const fetchTimetable = useMemo(
    () =>
      debounce(async (query: RequestQuery) => {
        setIsFetching(true);
        const queryDate = [query.date.slice(8, 10), query.date.slice(5, 7), query.date.slice(0, 4)].join('.');

        const url = new URL(`${location.origin}/api/timetable`);
        url.searchParams.set('station', query.name);
        url.searchParams.set('type', query.type);
        url.searchParams.set('date', queryDate);
        url.searchParams.set('time', query.time);

        const res = await fetch(url);
        const json = (await res.json()) as TimetableResponse;

        setData(json);
        setIsFetching(false);
      }, 1000),
    []
  );

  // initialize query
  const [isReady, setIsReady] = useState(false);
  const [query, setQuery] = useState<RequestQuery>({
    name: '',
    type: '',
    date: '',
    time: '',
  });
  useEffect(() => {
    if (!router.isReady || isReady) {
      return;
    }
    setQuery(() => ({
      name: router.query.name as string,
      type: (router.query.type as string) || 'dep',
      date: (router.query.date as string) || '',
      time: (router.query.time as string) || '',
    }));
    setIsReady(true);
  }, [router.isReady, router.query, isReady]);

  // fetch
  const updateQuery = useCallback(
    (newQuery: Partial<RequestQuery>) => {
      setQuery((query) => ({
        ...query,
        ...newQuery,
      }));
    },
    [setQuery]
  );
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (query.name === '') {
      return;
    }
    if (JSON.stringify(router.query) === JSON.stringify(query)) {
      return;
    }
    router.replace({
      pathname: router.pathname,
      query,
    });
  }, [router, query]);
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const query: RequestQuery = {
      name: router.query.name as string,
      type: (router.query.type as string) || 'dep',
      date: (router.query.date as string) || new Date().toISOString().slice(0, 10),
      time: (router.query.time as string) || new Date().toISOString().slice(11, 16),
    };
    fetchTimetable(query);
  }, [router.isReady, router.query, fetchTimetable]);

  return (
    <div>
      <Head>
        <title>Timetable at {data?.data.station ?? ''}</title>
      </Head>

      <div className="sticky top-0 mb-4 flex flex-col border-b border-gray-300 bg-white text-sm">
        <p className="border-b border-dashed border-gray-300">
          <input
            className="w-full p-2"
            type="text"
            name="station"
            value={query.name}
            onChange={(e) => {
              updateQuery({ name: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') {
                return;
              }
              query.name !== name && updateQuery({ name: query.name });
            }}
            onBlur={() => {
              query.name !== name && updateQuery({ name: query.name });
            }}
          />
        </p>
        <p className="flex border-b border-dashed border-gray-300">
          <input
            className="w-1/2 p-2"
            type="date"
            name="date"
            value={query.date || new Date().toISOString().slice(0, 10)}
            onChange={(e) => {
              updateQuery({ date: e.target.value });
            }}
          />
          <input
            className="w-1/2 p-2"
            type="time"
            name="time"
            value={query.time || new Date().toISOString().slice(11, 16)}
            onChange={(e) => {
              updateQuery({ time: e.target.value });
            }}
          />
        </p>
        <p className="flex">
          <label className="w-1/2 p-2">
            <input
              className="mr-2"
              type="radio"
              name="type"
              value="dep"
              checked={(query.type || 'dep') === 'dep'}
              onChange={(e) => {
                updateQuery({ type: e.target.value });
              }}
            />
            Departure
          </label>
          <label className="w-1/2 p-2">
            <input
              className="mr-2"
              type="radio"
              name="type"
              value="arr"
              checked={(query.type || 'dep') === 'arr'}
              onChange={(e) => {
                updateQuery({ type: e.target.value });
              }}
            />
            Arrival
          </label>
        </p>
      </div>

      {isFetching && <p>Fetching</p>}

      {data && (
        <div className="flex flex-col">
          {data.data.journeys.map((journey, i) => {
            const information = [
              journey.information.replaced ? `Replaced: ${journey.information.replacedTo}` : '',
              journey.information.changedRoute ? 'Changed Route' : '',
              journey.information.changedOrigin ? `Changed Origin: ${journey.information.changedOriginTo}` : '',
              journey.information.changedDestination
                ? `Changed Destination: ${journey.information.changedDestinationTo}`
                : '',
              journey.information.specialTrain ? 'Special Train' : '',
              journey.information.replacementTrain
                ? `Replacement Train: ${journey.information.replacementTrainFrom}`
                : '',
              ...journey.information.others,
            ]
              .filter((info) => info)
              .join(', ');

            const detailPath = journey.trainDetailUrl.replace(
              /^https:\/\/reiseauskunft\.bahn\.de\/bin\/traininfo\.exe\/dn\/(\d+\/\d+\/\d+\/\d+\/\d+)\?.+$/,
              '$1'
            );

            return (
              <div className="flex flex-wrap gap-2 border-b border-dashed border-gray-300 p-2 text-xs" key={i}>
                <p className="w-16">
                  <span className={journey.information.canceled ? 'font-bold text-red-500 line-through' : ''}>
                    {journey.time}
                  </span>
                  <br />
                  {journey.actualTime && journey.time !== journey.actualTime && (
                    <span className={journey.delayed ? 'text-red-500' : ''}>&gt;{journey.actualTime}</span>
                  )}
                </p>
                <p className="flex-grow">
                  <Link href={`/traininfo/routes/${detailPath}?date=${query.date}`}>
                    <a className="underline">{journey.train}</a>
                  </Link>
                  <br />
                  <span>{journey.destination}</span>
                </p>
                <p className={['w-12', journey.information.changedPlatform ? 'font-bold text-red-500' : ''].join(' ')}>
                  {journey.platform}
                </p>
                {information && (
                  <div className="w-full text-red-500">
                    <p>* {information}</p>
                  </div>
                )}
                {journey.message && (
                  <div className="w-full">
                    <p lang="de-DE">{journey.message.title}</p>
                    <p lang="de-DE">{journey.message.text}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Page;
