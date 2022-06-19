import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { parseData } from '../../../utils/api/timetable/data';
import { parseIdSelect } from '../../../utils/api/timetable/id-select';
import { parseJourneys } from '../../../utils/api/timetable/journey';
import { TimetableData } from '../../../utils/api/timetable/types';

const baseUrl = 'https://reiseauskunft.bahn.de';

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = new URL(`${baseUrl}/bin/bhftafel.exe/dn`);
  url.searchParams.set('input', (req.query.id as string) || (req.query.station as string));
  url.searchParams.set('boardType', req.query.type as string);
  url.searchParams.set('date', req.query.date as string);
  url.searchParams.set('time', req.query.time as string);
  url.searchParams.set('productsFilter', '11111');
  url.searchParams.set('rt', '1');
  url.searchParams.set('start', 'yes');

  const resp = await fetch(url.href);
  const html = await resp.text();

  const journeys = parseJourneys(html, req.query.type as 'dep' | 'arr');
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
