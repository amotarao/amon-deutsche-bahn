import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { parseData } from '../../../utils/api/traininfo/data';
import { parseRoute } from '../../../utils/api/traininfo/route';
import { TraininfoData } from '../../../utils/api/traininfo/types';

const baseUrl = 'https://reiseauskunft.bahn.de';

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = new URL(`${baseUrl}/bin/traininfo.exe/dn/${(req.query.path as string[]).join('/')}`);
  url.searchParams.set('date', req.query.date as string);
  url.searchParams.set('rt', '1');

  Object.entries(req.query).forEach(([key, value]) => {
    url.searchParams.set(key, value as string);
  });

  const resp = await fetch(url.href);
  const html = await resp.text();

  const data = parseData(html);
  const route = parseRoute(html);

  const json: TraininfoData = {
    route,
    ...data,
  };

  res.status(200).json({ data: json });
};

export default api;
