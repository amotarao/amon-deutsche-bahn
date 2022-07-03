import { TimetableRequestQuery } from '../../pages/timetable/stations/[name]';
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
    query.type === 'both' ? `${location.origin}/api/timetable/depArr` : `${location.origin}/api/timetable`
  );
  url.searchParams.append('station', query.name);
  url.searchParams.append('id', query.id);
  url.searchParams.append('date', query.date);
  url.searchParams.append('time', query.time);
  query.filter.forEach((f) => {
    url.searchParams.append('filter', f);
  });
  url.searchParams.append('type', query.type);
  url.searchParams.append('ignoreNullablePlatform', query.ignoreNullablePlatform);

  const res = await fetch(url);
  const data = (await res.json()) as TimetableResponse | TimetableWithArrivalDepartureResponse;

  caches.push({ data, queryString, fetchedAt: now });
  return data;
};
