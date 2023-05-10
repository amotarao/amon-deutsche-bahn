import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { TimetableResponse, TimetableWithArrivalDepartureResponse } from '../../utils/api/timetable/types';

export type TimetableRequestQuery = {
  name: string;
  id: string;
  date: string;
  time: string;
  type: string;
  filter: string[];
  ignoreNullablePlatform: 'true' | 'false';
};

export const fetchTimetable = async (
  name: string,
  searchParams: {
    [key: string]: string;
  },
  requestInit?: RequestInit
): Promise<TimetableResponse | TimetableWithArrivalDepartureResponse> => {
  const query: TimetableRequestQuery = {
    name,
    id: (searchParams.id as string) || '',
    date: (searchParams.date as string) || getGermanyDate(),
    time: (searchParams.time as string) || getGermanyTime(),
    filter: Array.isArray(searchParams.filter)
      ? searchParams.filter
      : searchParams.filter
      ? [searchParams.filter]
      : ['express', 'train', 's-bahn'],
    type: (searchParams.type as string) || 'both',
    ignoreNullablePlatform: searchParams.ignoreNullablePlatform === 'true' ? 'true' : 'false',
  };

  const url = new URL(
    query.type === 'both'
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/timetable/depArr`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/timetable`
  );
  url.searchParams.set('station', query.name);
  url.searchParams.set('id', query.id);
  url.searchParams.set('date', query.date);
  url.searchParams.set('time', query.time);
  url.searchParams.set('filter', Array.isArray(query.filter) ? query.filter.join(',') : query.filter);
  url.searchParams.set('type', query.type);
  url.searchParams.set('ignoreNullablePlatform', query.ignoreNullablePlatform);

  const res = await fetch(url, requestInit);
  const data = (await res.json()) as TimetableResponse | TimetableWithArrivalDepartureResponse;
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
