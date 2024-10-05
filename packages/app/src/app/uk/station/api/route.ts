import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { DepartureArrival } from "../_types";

dayjs.extend(customParseFormat);

export async function GET(request: Request) {
  const url = new URL(request.url);

  const stationCode = url.searchParams.get("station-code");
  const dateUnix = url.searchParams.get("date-unix");
  const dateTime = dateUnix
    ? dayjs.unix(Number(dateUnix)).toISOString()
    : dayjs().toISOString();

  if (!stationCode) {
    return Response.json(
      { error: "station-code is required" },
      { status: 400 },
    );
  }

  const [departure, arrival] = await Promise.all([
    fetchDepartureBoard({ stationCode, dateTime }),
    fetchArrivalBoard({ stationCode, dateTime }),
  ]);
  return Response.json({ departure, arrival } as DepartureArrival);
}

type FetchDepartureBoardParams = {
  stationCode: string;
  dateTime: string;
};

async function fetchDepartureBoard({
  stationCode,
  dateTime,
}: FetchDepartureBoardParams) {
  const res = await fetch("https://nreservices.nationalrail.co.uk/live-info", {
    headers: {
      accept: "*/*",
      "accept-language":
        "de-DE,de;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6,en;q=0.5",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
    },
    referrer: "https://www.nationalrail.co.uk/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `{"query":"query DepartureBoard($crs: String!, $toCrs: String, $time: String, $serviceTypes: [NreServiceMode], $timeWindow: Int, $numRows: Int) {\\n  DepartureBoard(\\n    crs: $crs\\n    toCrs: $toCrs\\n    time: $time\\n    serviceTypes: $serviceTypes\\n    timeWindow: $timeWindow\\n    numRows: $numRows\\n  ) {\\n    ...boardResult\\n  }\\n}\\n\\nfragment boardResult on NreStationBoard {\\n  generatedAt\\n  nrccMessages {\\n    message\\n    severity\\n  }\\n  departureStation {\\n    locationName\\n    crs\\n    via\\n  }\\n  filterStation {\\n    locationName\\n    crs\\n    via\\n  }\\n  services {\\n    rid\\n    serviceType {\\n      mode\\n      category\\n    }\\n    origin {\\n      locationName\\n      crs\\n      via\\n    }\\n    destination {\\n      locationName\\n      crs\\n      via\\n    }\\n    journeyDetails {\\n      from {\\n        locationName\\n        crs\\n        via\\n      }\\n      to {\\n        locationName\\n        crs\\n        via\\n      }\\n      stops\\n      departureInfo {\\n        scheduled\\n        estimated\\n        actual\\n      }\\n      arrivalInfo {\\n        scheduled\\n        estimated\\n        actual\\n      }\\n    }\\n    operator {\\n      name\\n      code\\n    }\\n    status {\\n      status\\n      delayReason\\n      cancelReason\\n    }\\n    departureInfo {\\n      scheduled\\n      estimated\\n      actual\\n    }\\n    arrivalInfo {\\n      scheduled\\n      estimated\\n      actual\\n    }\\n    platform\\n    loadingLevel\\n  }\\n}\\n","variables":{"crs":"${stationCode}","time":"${dateTime}","timeWindow":120,"serviceTypes":["Bus","Ferry","Train"]},"operationName":"DepartureBoard"}`,
    method: "POST",
    mode: "cors",
    credentials: "omit",
  });
  const json = await res.json();
  return json.data.DepartureBoard;
}

type FetchArrivalBoardParams = {
  stationCode: string;
  dateTime: string;
};

async function fetchArrivalBoard({
  stationCode,
  dateTime,
}: FetchArrivalBoardParams) {
  const res = await fetch("https://nreservices.nationalrail.co.uk/live-info", {
    headers: {
      accept: "*/*",
      "accept-language":
        "de-DE,de;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6,en;q=0.5",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      Referer: "https://www.nationalrail.co.uk/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `{"query":"query ArrivalBoard($crs: String!, $fromCrs: String, $time: String, $serviceTypes: [NreServiceMode], $timeWindow: Int, $numRows: Int) {\\n  ArrivalBoard(\\n    crs: $crs\\n    fromCrs: $fromCrs\\n    time: $time\\n    serviceTypes: $serviceTypes\\n    timeWindow: $timeWindow\\n    numRows: $numRows\\n  ) {\\n    ...boardResult\\n  }\\n}\\n\\nfragment boardResult on NreStationBoard {\\n  generatedAt\\n  nrccMessages {\\n    message\\n    severity\\n  }\\n  departureStation {\\n    locationName\\n    crs\\n    via\\n  }\\n  filterStation {\\n    locationName\\n    crs\\n    via\\n  }\\n  services {\\n    rid\\n    serviceType {\\n      mode\\n      category\\n    }\\n    origin {\\n      locationName\\n      crs\\n      via\\n    }\\n    destination {\\n      locationName\\n      crs\\n      via\\n    }\\n    journeyDetails {\\n      from {\\n        locationName\\n        crs\\n        via\\n      }\\n      to {\\n        locationName\\n        crs\\n        via\\n      }\\n      stops\\n      departureInfo {\\n        scheduled\\n        estimated\\n        actual\\n      }\\n      arrivalInfo {\\n        scheduled\\n        estimated\\n        actual\\n      }\\n    }\\n    operator {\\n      name\\n      code\\n    }\\n    status {\\n      status\\n      delayReason\\n      cancelReason\\n    }\\n    departureInfo {\\n      scheduled\\n      estimated\\n      actual\\n    }\\n    arrivalInfo {\\n      scheduled\\n      estimated\\n      actual\\n    }\\n    platform\\n    loadingLevel\\n  }\\n}\\n","variables":{"crs":"${stationCode}","time":"${dateTime}","timeWindow":120,"serviceTypes":["Bus","Ferry","Train"]},"operationName":"ArrivalBoard"}`,
    method: "POST",
  });
  const json = await res.json();
  return json.data.ArrivalBoard;
}
