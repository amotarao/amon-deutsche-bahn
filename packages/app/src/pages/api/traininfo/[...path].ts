import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { parseData } from '../../../utils/api/traininfo/data';
import { parseRoute } from '../../../utils/api/traininfo/route';
import { TraininfoData } from '../../../utils/api/traininfo/types';

const baseUrl = 'https://reiseauskunft.bahn.de';

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = new URL(`${baseUrl}/bin/traininfo.exe/dn/${(req.query.path as string[]).join('/')}`);
  url.searchParams.set('date', formatDate(req.query.date as string));
  url.searchParams.set('rt', '1');

  const resp = await fetch(url.href);
  const html = await resp.text();

  const route = parseRoute(html);
  const data = parseData(html);

  const json: TraininfoData = {
    route,
    ...data,
  };

  res.status(200).json({ data: json });
};

export default api;

const formatDate = (date: string): string => {
  return [date.slice(8, 10), date.slice(5, 7), date.slice(0, 4)].join('.');
};
