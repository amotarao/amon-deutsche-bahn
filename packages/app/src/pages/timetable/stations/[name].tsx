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

const Page: NextPage<Props> = ({ name }) => {
  const router = useRouter();

  const [tmpName, setTmpName] = useState(name);
  const type = router.query.type || 'dep';
  const date = router.query.date || new Date().toISOString().slice(0, 10);
  const time = router.query.time || new Date().toISOString().slice(11, 16);

  const [data, setData] = useState<JourneyResponse | null>(null);
  useEffect(() => {
    (async () => {
      const queryDate = [date.slice(8, 10), date.slice(5, 7), date.slice(0, 4)].join('.');
      const res = await fetch(
        `/api/timetable?station=${encodeURIComponent(name)}&type=${type}&date=${queryDate}&time=${time}`
      );
      const json = (await res.json()) as JourneyResponse;
      setData(json);
    })();
  }, [name, type, date, time]);

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
            value={tmpName}
            onChange={(e) => {
              setTmpName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name !== tmpName) {
                router.push({
                  pathname: '/timetable/stations/[name]',
                  query: { ...router.query, name: tmpName },
                });
              }
            }}
            onBlur={() => {
              if (name !== tmpName) {
                router.push({
                  pathname: '/timetable/stations/[name]',
                  query: { ...router.query, name: tmpName },
                });
              }
            }}
          />
        </p>
        <p className="flex border-b border-dashed border-gray-300">
          <input
            className="w-1/2 p-2"
            type="date"
            name="date"
            value={date}
            onChange={(e) => {
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  date: e.target.value,
                },
              });
            }}
          />
          <input
            className="w-1/2 p-2"
            type="time"
            name="time"
            value={time}
            onChange={(e) => {
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  time: e.target.value,
                },
              });
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
              checked={type === 'dep'}
              onChange={(e) => {
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    type: e.target.value,
                  },
                });
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
              checked={type === 'arr'}
              onChange={(e) => {
                router.push({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    type: e.target.value,
                  },
                });
              }}
            />
            Arrival
          </label>
        </p>
      </div>

      {data ? (
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
                <p className="w-56">
                  <a className="underline" href={journey.trainDetailUrl} target="_blank" rel="noopener noreferrer">
                    {journey.train}
                  </a>
                  <br />
                  <span>{journey.destination}</span>
                </p>
                <p className={['w-8', journey.information.changedPlatform ? 'font-bold text-red-500' : ''].join(' ')}>
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
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default Page;
