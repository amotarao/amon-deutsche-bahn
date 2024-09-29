export type Station = {
  name: string;
  arrival: {
    date: string;
    time: string;
    delay: number | null;
    platform: string | null;
  } | null;
  departure: {
    date: string;
    time: string;
    delay: number | null;
    platform: string | null;
  } | null;
};

export type ApiResponse = {
  name: string;
  stations: Station[];
};
