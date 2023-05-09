import { TimetableRequestQuery } from '../../app/timetable/stations/[name]/page';
import { TimetableResponse, TimetableWithArrivalDepartureResponse } from '../../utils/api/timetable/types';

const caches: {
  data: TimetableResponse | TimetableWithArrivalDepartureResponse;
  queryString: string;
  fetchedAt: Date;
}[] = [];

export const fetchTimetable = async (
  query: TimetableRequestQuery
): Promise<TimetableResponse | TimetableWithArrivalDepartureResponse> => {
  const queryString = JSON.stringify(query);
  const now = new Date();
  const cache = caches.find((cache) => cache.queryString === queryString);
  if (cache && cache.fetchedAt.getTime() + 1000 * 60 * 3 >= now.getTime()) {
    return cache.data;
  }
  if (cache) {
    const index = caches.indexOf(cache);
    caches.splice(index, 1);
  }

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

  const res = await fetch(url);
  const data = (await res.json()) as TimetableResponse | TimetableWithArrivalDepartureResponse;

  caches.push({ data, queryString, fetchedAt: now });
  return data;
};
