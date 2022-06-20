import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { arrayQuery, formatDate, stringifyQuery } from '../../../utils/api/format';
import { parseData } from '../../../utils/api/traininfo/data';
import { parseRoute } from '../../../utils/api/traininfo/route';
import { TraininfoData } from '../../../utils/api/traininfo/types';

const generateUrl = (query: NextApiRequest['query']): string => {
  const baseUrl = 'https://reiseauskunft.bahn.de';
  const url = new URL(`${baseUrl}/bin/traininfo.exe/dn/${arrayQuery(query, 'path', true).join('/')}`);
  url.searchParams.set('date', formatDate(stringifyQuery(query, 'date', true)));
  url.searchParams.set('rt', '1');
  return url.href;
};

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const resp = await fetch(generateUrl(req.query));
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
