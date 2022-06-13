export type Journey = {
  time: string;
  actualTime: string | null;
  delayed: boolean;
  train: string;
  trainDetailUrl: string;
  destination: string;
  stops: JourneyStop[];
  platform: string | null;
  message: JourneyMessage | null;
  information: JourneyInformation;
};

export type JourneyStop = {
  station: string;
  time: string;
  noStop: boolean;
};

export type JourneyMessage = {
  title: string;
  text: string;
  ajaxUrl: string;
};

export type JourneyInformation = {
  canceled: boolean;
  replaced: boolean;
  changedPlatform: boolean;
  changedRoute: boolean;
  specialTrain: boolean;
  replacementTrain: boolean;
  others: string[];
};

export type JourneyMeta = {
  station: string;
  stationId: string;
  date: string;
  time: string;
  type: string;
};

export type JourneyResponse = {
  data: {
    journeys: Journey[];
  };
  meta: JourneyMeta;
};
