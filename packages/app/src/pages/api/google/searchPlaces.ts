import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { stringifyQuery } from '../../../utils/api/format';

type PlacesAPICandidate = {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
};

export type PlacesAPIResponse = {
  candidates: PlacesAPICandidate[];
  status: 'OK';
};

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
  url.searchParams.set('key', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string);
  url.searchParams.set('input', stringifyQuery(req.query, 'keyword', true));
  url.searchParams.set('inputtype', 'textquery');
  url.searchParams.set('fields', ['place_id', 'name', 'geometry'].join(','));
  const resp = await fetch(url.href);
  const json = (await resp.json()) as PlacesAPIResponse;
  res.status(200).json(json);
};

export default api;
