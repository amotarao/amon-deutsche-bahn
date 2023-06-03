import type { NextApiHandler, NextApiRequest } from 'next';
import { stringifyQuery } from '../../../utils/api/format';
import {
  TimetableResponse,
  JourneyWithArrivalDepartureInformation,
  TimetableWithArrivalDepartureResponse,
} from '../../../utils/api/timetable/types';

const fetchJourneys = async (query: NextApiRequest['query'], type: 'dep' | 'arr'): Promise<TimetableResponse> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/timetable`);
  url.searchParams.set('id', stringifyQuery(query, 'id') || stringifyQuery(query, 'station', true));
  url.searchParams.set('date', stringifyQuery(query, 'date', true));
  url.searchParams.set('time', stringifyQuery(query, 'time', true));
  'trainType' in query && url.searchParams.set('trainType', stringifyQuery(query, 'trainType'));
  url.searchParams.set('type', type);

  const resp = await fetch(url.href);
  const json = (await resp.json()) as TimetableResponse;
  return json;
};

const api: NextApiHandler = async (req, res) => {
  const [depRes, arrRes] = await Promise.all([fetchJourneys(req.query, 'dep'), fetchJourneys(req.query, 'arr')]);
  const {
    data: { journeyItems: depJourneys, ...baseData },
  } = depRes;
  const {
    data: { journeyItems: arrJourneys },
  } = arrRes;

  const baseJourneys: JourneyWithArrivalDepartureInformation[] = arrJourneys.map((journey) => {
    const { information, ...data } = journey;
    return {
      ...data,
      arrivalInformation: information,
      departureInformation: null,
    };
  });

  depJourneys.forEach((depJourney) => {
    const target = baseJourneys.find((arrJourney) => {
      // 既にマッチングが済んでいるもの
      if (arrJourney.departureTime || arrJourney.departureActualTime) {
        return false;
      }

      // 列車名自体が違うもの
      if (arrJourney.train !== depJourney.train) {
        return false;
      }

      // ホームの記載がないもの
      // ただし、フランスの長距離列車系は除く
      if (
        !['TGV', 'THA', 'OGV'].includes(arrJourney.train.slice(0, 3)) &&
        (!arrJourney.platform || !depJourney.platform)
      ) {
        return false;
      }

      // イギリスの列車名不明
      if (arrJourney.train === '---') {
        return false;
      }

      // S-Bahn
      if (arrJourney.train.match(/^S(\s*\d+)?$/)) {
        if (
          arrJourney.platform === depJourney.platform &&
          arrJourney.origin !== depJourney.destination &&
          timeToNumberForCalc(arrJourney.arrivalTime || '') <= timeToNumberForCalc(depJourney.departureTime || '') &&
          timeToNumberForCalc(depJourney.departureTime || '') <= timeToNumberForCalc(arrJourney.arrivalTime || '') + 5
        ) {
          return true;
        }
        return false;
      }

      return true;
    });

    if (target) {
      target.departureTime = depJourney.departureTime;
      target.departureActualTime = depJourney.departureActualTime;
      target.destination = depJourney.destination;
      target.stops = [...target.stops, ...depJourney.stops];
      target.departureInformation = depJourney.information;
      return;
    }

    const { information, ...data } = depJourney;
    const j = {
      ...data,
      arrivalInformation: null,
      departureInformation: information,
    };
    baseJourneys.push(j);
  });

  const json: TimetableWithArrivalDepartureResponse = {
    data: {
      journeyItems: baseJourneys.sort((a, b) => {
        const aTime = parseInt(
          (a.arrivalActualTime || a.arrivalTime || a.departureActualTime || a.departureTime)?.replace(/:/, '') ?? '0',
          10
        );
        const bTime = parseInt(
          (b.arrivalActualTime || b.arrivalTime || b.departureActualTime || b.departureTime)?.replace(/:/, '') ?? '0',
          10
        );
        return aTime - bTime;
      }),
      ...baseData,
    },
  };

  res.status(200).json(json);
};

export default api;

const timeToNumberForCalc = (time: string): number => {
  const [, h, m] = time.match(/(\d+):(\d+)/) || ['0', '0', '0'];
  const num = parseInt(h, 10) * 60 + parseInt(m, 10);
  return num;
};
