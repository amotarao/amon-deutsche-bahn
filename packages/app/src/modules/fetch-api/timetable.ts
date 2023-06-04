import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { TimetableWithArrivalDepartureResponse } from '../../utils/api/timetable/types';

export type TimetableRequestQuery = {
  name: string;
  id: string;
  date: string;
  time: string;
  type: string;
  trainType: string[];
};

export const fetchTimetable = async (
  name: string,
  searchParams: {
    [key: string]: string;
  },
  requestInit?: RequestInit
): Promise<TimetableWithArrivalDepartureResponse> => {
  const query: TimetableRequestQuery = {
    name: decodeURIComponent(name),
    id: (searchParams.id as string) || '',
    date: (searchParams.date as string) || getGermanyDate(),
    time: (searchParams.time as string) || getGermanyTime(),
    trainType: Array.isArray(searchParams.trainType)
      ? searchParams.trainType
      : searchParams.trainType
      ? [searchParams.trainType]
      : ['express', 'train', 's-bahn'],
    type: (searchParams.type as string) || 'both',
  };

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/timetable/depArr`);
  url.searchParams.set('station', query.name);
  url.searchParams.set('id', query.id);
  url.searchParams.set('date', query.date);
  url.searchParams.set('time', query.time);
  url.searchParams.set('trainType', 'express,train,s-bahn');

  const res = await fetch(url, requestInit);
  const data = (await res.json()) as TimetableWithArrivalDepartureResponse;
  return data;
};

dayjs.extend(utc);
dayjs.extend(timezone);

export const getGermanyDate = (): string => {
  return dayjs().tz('Europe/Berlin').format('YYYY-MM-DD');
};

export const getGermanyTime = (): string => {
  return dayjs().tz('Europe/Berlin').format('HH:mm');
};
