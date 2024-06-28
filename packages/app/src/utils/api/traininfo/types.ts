export type Route = Station[];

export type Station = {
  name: string;
  detailHref: string;
  arrivalTime: string | null;
  arrivalActualTime: string | null;
  arrivalDelayed: boolean;
  departureTime: string | null;
  departureActualTime: string | null;
  departureDelayed: boolean;
  platform: string;
  information: StationInformation;
};

export type StationInformation = {
  changedPlatform: boolean;
  noStop: boolean;
  extraStop: boolean;
  message: string[];
};

export type TrainInfoMeta = {
  station: string;
  stationId: string;
  date: string;
  time: string;
  type: string;
};

export type TrainInfoData = {
  route: Route;
  train: string;
  validFrom: string;
  information: string[];
  remark: {
    title: string;
    text: string;
  }[];
};

export type TrainInfoResponse = {
  data: TrainInfoData;
};
