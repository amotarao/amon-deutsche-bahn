async function getFirstCookie() {
  const url = new URL("https://www.bahn.de/buchung/abfahrten-ankuenfte");
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
  });

  const cookie = response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
  return cookie;
}

async function getSecondCookie(firstCookie: string) {
  const url = new URL("https://www.bahn.de/web/api/reiseloesung/abfahrten");
  url.searchParams.append("datum", new Date().toISOString().slice(0, 10));
  url.searchParams.append("zeit", "00:00:00");
  url.searchParams.append("ortExtId", "8000261");
  url.searchParams.append(
    "ortId",
    "A=1@O=München Hbf@X=11558339@Y=48140229@U=80@L=8000261@B=1@p=1745872002@i=U%008020347@",
  );
  url.searchParams.append("mitVias", "true");
  url.searchParams.append("maxVias", "8");
  [
    "ICE",
    "EC_IC",
    "IR",
    "REGIONAL",
    "SBAHN",
    "BUS",
    "SCHIFF",
    "UBAHN",
    "TRAM",
    "ANRUFPFLICHTIG",
  ].forEach((v) => {
    url.searchParams.append("verkehrsmittel[]", v);
  });

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      Cookie: firstCookie,
    },
  });

  const cookie = response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
  return cookie;
}

export async function getCookie() {
  const firstCookie = await getFirstCookie();
  const secondCookie = await getSecondCookie(firstCookie);
  return firstCookie + "; " + secondCookie;
}
