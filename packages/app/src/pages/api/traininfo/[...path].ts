import type { NextApiHandler, NextApiRequest } from "next";
import {
  arrayQuery,
  formatDate,
  stringifyQuery,
} from "../../../utils/api/format";
import { parseData } from "../../../utils/api/traininfo/data";
import { parseRoute } from "../../../utils/api/traininfo/route";
import type { TrainInfoData } from "../../../utils/api/traininfo/types";

const generateUrl = (query: NextApiRequest["query"]): string => {
  const baseUrl = "https://reiseauskunft.bahn.de";
  const url = new URL(
    `${baseUrl}/bin/traininfo.exe/dn/${arrayQuery(query, "path", true).join("/")}`,
  );
  url.searchParams.set("date", formatDate(stringifyQuery(query, "date", true)));
  url.searchParams.set("rt", "1");
  return url.href;
};

const api: NextApiHandler = async (req, res) => {
  const resp = await fetch(generateUrl(req.query));
  const html = await resp.text();

  const route = parseRoute(html);
  const data = parseData(html);

  const json: TrainInfoData = {
    route,
    ...data,
  };

  res.status(200).json({ data: json });
};

export default api;
