export type Departure = {
  date: string;
  time: string;
  train: string;
  destination: string;
  operator: string;
  delay: number | null;
  platform: string | null;
};

export type Arrival = {
  date: string;
  time: string;
  train: string;
  origin: string;
  operator: string;
  delay: number | null;
  platform: string | null;
};

type TrainArrivalOrDeparture = {
  date: string;
  time: string;
  delay: number | null;
  platform: string | null;
};

export type Train = {
  train: string;
  operator: string;
  origin: string | null;
  destination: string | null;
} & (
  | { arrival: TrainArrivalOrDeparture; departure: null }
  | { arrival: null; departure: TrainArrivalOrDeparture }
  | { arrival: TrainArrivalOrDeparture; departure: TrainArrivalOrDeparture }
);

export type ApiResponse = {
  name: string;
  trains: Train[];
};
