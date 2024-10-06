type Station = {
  locationName: string;
  crs: string;
  via: string | null;
};

export type TrainService = {
  rid: string;
  serviceType: {
    mode: string;
    category: string;
  };
  origin: Station[];
  destination: Station[];
  journeyDetails: {
    from: Station;
    to: Station;
    stops: number;
    departureInfo: {
      scheduled: string;
      estimated: string | null;
      actual: string | null;
    };
    arrivalInfo: {
      scheduled: string;
      estimated: string | null;
      actual: string | null;
    };
  };
  operator: {
    name: string;
    code: string;
  };
  status: {
    status: string;
    delayReason: string | null;
    cancelReason: string | null;
  };
  departureInfo: {
    scheduled: string;
    estimated: string | null;
    actual: string | null;
  } | null;
  arrivalInfo: {
    scheduled: string;
    estimated: string | null;
    actual: string | null;
  } | null;
  platform: string;
  loadingLevel: string;
};

export type DepartureArrivalData = {
  generatedAt: string;
  nrccMessages: string | null;
  departureStation: Station;
  filterStation: string | null;
  services: TrainService[];
};

export type DepartureArrival = {
  departure: DepartureArrivalData;
  arrival: DepartureArrivalData;
};

export type ApiResponse = {
  generatedAt: string;
  nrccMessages: string | null;
  station: Station;
  filterStation: string | null;
  nextDateUnix: number;
  services: TrainService[];
};
