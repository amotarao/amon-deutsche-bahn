export type Station = {
  countryCode: string;
  stationID: string;
  validFrom: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    houseNumber: string;
  };
  stationCategory?: string;
  timeZone: string;
  position: {
    geohash: string;
    lat: number;
    lng: number;
  };
  owner: {
    name: string;
    organisationalUnit: {
      id: 4;
      name: string;
      nameShort: string;
    };
  };
  availableTransports: [];
  availableLocalServices: [];
};
