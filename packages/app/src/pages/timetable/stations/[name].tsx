import { useDebounce } from '@react-hook/debounce';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { JourneyResponse } from '../../../utils/api/timetable/types';

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

  const [tmpQuery, setTmpQuery] = useState<RequestQuery>({
    name,
    type: (router.query.type as string) || 'dep',
    date: (router.query.date as string) || new Date().toISOString().slice(0, 10),
    time: (router.query.time as string) || new Date().toISOString().slice(11, 16),
  });
  const [queryForRequest, setQueryForRequest] = useDebounce(tmpQuery, 1500);

  useEffect(() => {
    setQueryForRequest(tmpQuery);
  }, [tmpQuery, setQueryForRequest]);
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (JSON.stringify(router.query) === JSON.stringify(queryForRequest)) {
      return;
    }
    router.push({
      pathname: router.pathname,
      query: queryForRequest,
    });
  }, [router, queryForRequest]);

  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<JourneyResponse | null>(null);
  useEffect(() => {
    (async () => {
      if (!router.isReady) {
        return;
      }
      setIsFetching(true);

      const query: RequestQuery = {
        name,
        type: (router.query.type as string) || 'dep',
        date: (router.query.date as string) || new Date().toISOString().slice(0, 10),
        time: (router.query.time as string) || new Date().toISOString().slice(11, 16),
      };
      const queryDate = [query.date.slice(8, 10), query.date.slice(5, 7), query.date.slice(0, 4)].join('.');

      const url = new URL(`${location.origin}/api/timetable`);
      url.searchParams.set('station', query.name);
      url.searchParams.set('type', query.type);
      url.searchParams.set('date', queryDate);
      url.searchParams.set('time', query.time);

      const res = await fetch(url);
      const json = (await res.json()) as JourneyResponse;
      setData(json);
      setIsFetching(false);
    })();
  }, [router, name]);

  return (
    <div>
      <Head>
        <title>Timetable at {data?.meta.station ?? ''}</title>
      </Head>

      <div className="sticky top-0 mb-4 flex flex-col border-b border-gray-300 bg-white text-sm">
        <p className="border-b border-dashed border-gray-300">
          <input
            className="w-full p-2"
            type="text"
            name="station"
            value={tmpQuery.name}
            onChange={(e) => {
              setTmpQuery((query) => ({ ...query, name: e.target.value }));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name !== tmpQuery.name) {
                setTmpQuery((query) => ({ ...query, name: tmpQuery.name }));
              }
            }}
            onBlur={() => {
              if (name !== tmpQuery.name) {
                setTmpQuery((query) => ({ ...query, name: tmpQuery.name }));
              }
            }}
          />
        </p>
        <p className="flex border-b border-dashed border-gray-300">
          <input
            className="w-1/2 p-2"
            type="date"
            name="date"
            value={tmpQuery.date}
            onChange={(e) => {
              setTmpQuery((query) => ({
                ...query,
                date: e.target.value,
              }));
            }}
          />
          <input
            className="w-1/2 p-2"
            type="time"
            name="time"
            value={tmpQuery.time}
            onChange={(e) => {
              setTmpQuery((query) => ({
                ...query,
                time: e.target.value,
              }));
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
              checked={tmpQuery.type === 'dep'}
              onChange={(e) => {
                setTmpQuery((query) => ({
                  ...query,
                  type: e.target.value,
                }));
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
              checked={tmpQuery.type === 'arr'}
              onChange={(e) => {
                setTmpQuery((query) => ({
                  ...query,
                  type: e.target.value,
                }));
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
            const infomation = [
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
                  <a className="underline" href={journey.trainDetailUrl} target="_blank" rel="noopener noreferrer">
                    {journey.train}
                  </a>
                  <br />
                  <span>{journey.destination}</span>
                </p>
                <p className={['w-12', journey.information.changedPlatform ? 'font-bold text-red-500' : ''].join(' ')}>
                  {journey.platform}
                </p>
                {infomation && (
                  <div className="w-full text-red-500">
                    <p>{infomation}</p>
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
