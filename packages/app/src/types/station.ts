export type Station = {
  name: string;
  googleMapsPlaceId: string;
  dbRisStationId: string;
  dbRisStationCateogry: string;
  position: {
    geohash: string;
    lat: number;
    lng: number;
  };
};

export type DBRisStation = {
  stationID: string;
  names: {
    DE: {
      name: string;
    };
  };
  address: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
  };
  stationCategory?: string;
  availableTransports: [];
  availableLocalServices: [];
  owner: {
    name: string;
    organisationalUnit: {
      id: number;
      name: string;
      nameShort: string;
    };
  };
  countryCode: string;
  timeZone: string;
  position: {
    longitude: number;
    latitude: number;
  };
  validFrom: string;
};
