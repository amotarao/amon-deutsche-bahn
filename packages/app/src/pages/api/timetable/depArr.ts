import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import {
  TimetableResponse,
  JourneyWithArrivalDepartureInformation,
  TimetableWithArrivalDepartureResponse,
} from '../../../utils/api/timetable/types';

const fetchJourneys = async (query: NextApiRequest['query'], type: 'dep' | 'arr'): Promise<TimetableResponse> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/timetable`);
  url.searchParams.set('id', (query.id as string) || (query.station as string));
  url.searchParams.set('date', query.date as string);
  url.searchParams.set('time', query.time as string);
  url.searchParams.set('type', type);

  const resp = await fetch(url.href);
  const json = (await resp.json()) as TimetableResponse;
  return json;
};

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const [depRes, arrRes] = await Promise.all([fetchJourneys(req.query, 'dep'), fetchJourneys(req.query, 'arr')]);
  const {
    data: { journeys: depJourneys, ...baseData },
  } = depRes;
  const {
    data: { journeys: arrJourneys },
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
      if (!arrJourney.platform || !depJourney.platform) {
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
      journeys: baseJourneys.sort((a, b) => {
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
