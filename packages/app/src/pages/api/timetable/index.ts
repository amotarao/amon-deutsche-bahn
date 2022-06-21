import { query } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { formatDate, stringifyQuery, booleanQuery } from '../../../utils/api/format';
import { parseData } from '../../../utils/api/timetable/data';
import { parseIdSelect } from '../../../utils/api/timetable/id-select';
import { parseJourneys } from '../../../utils/api/timetable/journey';
import { Journey, TimetableData } from '../../../utils/api/timetable/types';

const parseFilter = (filter: string): string => {
  if (filter === 'all') return '11111';
  if (filter === 'express') return '11000';
  if (filter === 'train') return '00110';
  if (filter === 's') return '00001';
  return '11111';
};

const generateUrl = (query: NextApiRequest['query']): string => {
  const url = new URL('https://reiseauskunft.bahn.de/bin/bhftafel.exe/dn');
  url.searchParams.set('input', stringifyQuery(query, 'id') || stringifyQuery(query, 'station', true));
  url.searchParams.set('boardType', stringifyQuery(query, 'type', true));
  url.searchParams.set('date', formatDate(stringifyQuery(query, 'date', true)));
  url.searchParams.set('time', stringifyQuery(query, 'time', true));
  url.searchParams.set('productsFilter', parseFilter(stringifyQuery(query, 'filter')));
  url.searchParams.set('rt', '1');
  url.searchParams.set('start', 'yes');
  return url.href;
};

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const resp = await fetch(generateUrl(req.query));
  const html = await resp.text();

  const filter = (journey: Journey): boolean => {
    if (booleanQuery(req.query, 'ignoreNullablePlatform')) {
      return !!journey.platform;
    }
    return true;
  };

  const journeys = parseJourneys(html, stringifyQuery(req.query, 'type') as 'dep' | 'arr').filter(filter);
  const ids = parseIdSelect(html);
  const data = parseData(html);

  const json: TimetableData = {
    journeys,
    ids,
    ...data,
  };

  res.status(200).json({ data: json });
};

export default api;
