export type TrainService = {
  rid: string;
  serviceType: {
    mode: string;
    category: string;
  };
  origin: {
    locationName: string;
    crs: string;
    via: string | null;
  }[];
  destination: {
    locationName: string;
    crs: string;
    via: string | null;
  }[];
  journeyDetails: {
    from: {
      locationName: string;
      crs: string;
      via: string | null;
    };
    to: {
      locationName: string;
      crs: string;
      via: string | null;
    };
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
  };
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
  departureStation: {
    locationName: string;
    crs: string;
    via: string | null;
  };
  filterStation: string | null;
  services: TrainService[];
};

export type DepartureArrival = {
  departure: DepartureArrivalData;
  arrival: DepartureArrivalData;
};
