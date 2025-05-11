import { XMLParser } from "fast-xml-parser";

type Security = {
  clientId: string;
  clientSecret: string;
};

export async function fchg(
  { clientId, clientSecret }: Security,
  evaNo: string,
) {
  const url = new URL(
    "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/fchg/{evaNo}",
  );
  url.pathname = url.pathname.replace(
    encodeURIComponent("{evaNo}"),
    encodeURIComponent(evaNo),
  );

  const res = await fetch(url, {
    headers: {
      accept: "application/xml",
      "DB-Client-Id": clientId,
      "DB-Api-Key": clientSecret,
    },
  });

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const json = parser.parse(xml);
  return json;
}

export async function plan(
  { clientId, clientSecret }: Security,
  evaNo: string,
  date: string,
  hour: string,
) {
  const url = new URL(
    "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/{evaNo}/{date}/{hour}",
  );
  url.pathname = url.pathname.replace(
    encodeURIComponent("{evaNo}"),
    encodeURIComponent(evaNo),
  );
  url.pathname = url.pathname.replace(
    encodeURIComponent("{date}"),
    encodeURIComponent(date),
  );
  url.pathname = url.pathname.replace(
    encodeURIComponent("{hour}"),
    encodeURIComponent(hour),
  );

  const res = await fetch(url, {
    headers: {
      accept: "application/xml",
      "DB-Client-Id": clientId,
      "DB-Api-Key": clientSecret,
    },
  });

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const json = parser.parse(xml);
  return json;
}

export async function rchg(
  { clientId, clientSecret }: Security,
  evaNo: string,
) {
  const url = new URL(
    "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/rchg/{evaNo}",
  );
  url.pathname = url.pathname.replace(
    encodeURIComponent("{evaNo}"),
    encodeURIComponent(evaNo),
  );

  const res = await fetch(url, {
    headers: {
      accept: "application/xml",
      "DB-Client-Id": clientId,
      "DB-Api-Key": clientSecret,
    },
  });

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const json = parser.parse(xml);
  return json;
}

export async function station(
  { clientId, clientSecret }: Security,
  pattern: string,
) {
  const url = new URL(
    "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/station/{pattern}",
  );
  url.pathname = url.pathname.replace(
    encodeURIComponent("{pattern}"),
    encodeURIComponent(pattern),
  );

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "DB-Client-Id": clientId,
      "DB-Api-Key": clientSecret,
    },
  });

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const json = parser.parse(xml);
  return json;
}
