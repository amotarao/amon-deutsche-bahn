import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { parseJourneys } from '../../utils/api/timetable/journey';
import { parseMeta } from '../../utils/api/timetable/meta';
import { JourneyResponse } from '../../utils/api/timetable/types';

const baseUrl = 'https://reiseauskunft.bahn.de';

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = new URL(`${baseUrl}/bin/bhftafel.exe/dn`);
  url.searchParams.set('input', req.query.station as string);
  url.searchParams.set('boardType', req.query.type as string);
  url.searchParams.set('date', req.query.date as string);
  url.searchParams.set('time', req.query.time as string);
  url.searchParams.set('productsFilter', '11111');
  url.searchParams.set('rt', '1');
  url.searchParams.set('start', 'yes');

  const resp = await fetch(url.href);
  const html = await resp.text();

  const meta = parseMeta(html);
  const journeys = parseJourneys(html);

  const json: JourneyResponse = {
    data: {
      journeys,
    },
    meta,
  };

  res.status(200).json(json);
};

export default api;
