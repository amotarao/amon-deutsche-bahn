export type Journey = {
  time: string;
  detailHref: string;
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
  replacedTo: string | null;
  changedPlatform: boolean;
  changedRoute: boolean;
  changedOrigin: boolean;
  changedOriginTo: string | null;
  changedDestination: boolean;
  changedDestinationTo: string | null;
  specialTrain: boolean;
  replacementTrain: boolean;
  replacementTrainFrom: string | null;
  others: string[];
};

export type TimetableData = {
  journeys: Journey[];
  name: string;
  id: string;
  date: string;
  time: string;
  type: string;
  ids: string[];
};

export type TimetableResponse = {
  data: TimetableData;
};
