type StationArrivalOrDeparture = {
  date: string;
  time: string;
  delay: number | null;
  platform: string | null;
};

export type Station = {
  name: string;
} & (
  | { arrival: StationArrivalOrDeparture; departure: null }
  | { arrival: null; departure: StationArrivalOrDeparture }
  | { arrival: StationArrivalOrDeparture; departure: StationArrivalOrDeparture }
);

export type ApiResponse = {
  name: string;
  stations: Station[];
};
