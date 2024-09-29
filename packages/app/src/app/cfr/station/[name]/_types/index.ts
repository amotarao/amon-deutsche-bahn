export type Departure = {
  time: string;
  train: string;
  destination: string;
  operator: string;
  delay: number | null;
  platform: string | null;
};

export type Arrival = {
  time: string;
  train: string;
  origin: string;
  operator: string;
  delay: number | null;
  platform: string | null;
};

export type Train = {
  train: string;
  operator: string;
  origin: string | null;
  destination: string | null;
  arrival: {
    time: string;
    delay: number | null;
    platform: string | null;
  } | null;
  departure: {
    time: string;
    delay: number | null;
    platform: string | null;
  } | null;
};

export type ApiResponse = {
  name: string;
  trains: Train[];
};
