import type { NextApiHandler, NextApiRequest } from 'next';
import { formatDate, stringifyQuery, booleanQuery } from '../../../utils/api/format';
import { parseData } from '../../../utils/api/timetable/data';
import { parseIdSelect } from '../../../utils/api/timetable/id-select';
import { parseJourneys } from '../../../utils/api/timetable/journey';
import { Journey, TimetableData, TrainType } from '../../../utils/api/timetable/types';

const parseFilter = (filter: string | string[]): string => {
  filter = Array.isArray(filter) ? filter : filter.split(',');

  const f: Record<TrainType, '0' | '1'> = {
    ice: '0',
    ic: '0',
    d: '0',
    nv: '0',
    s: '0',
    bus: '0',
    ferry: '0',
    u: '0',
    tram: '0',
    taxi: '0',
  };

  if (filter.includes('express')) {
    f.ice = '1';
    f.ic = '1';
    f.d = '1';
  }
  if (filter.includes('train')) {
    f.nv = '1';
  }
  if (filter.includes('s-bahn')) {
    f.s = '1';
  }

  return Object.values(f).join('');
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

const api: NextApiHandler = async (req, res) => {
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
