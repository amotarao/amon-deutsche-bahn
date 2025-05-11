import { Place } from ".";
import { Entry } from "../_lib/bahnhof.de/types";

export type StationTimetable2Response = {
  ort: Place;
  journeys: Journey2[];
};

export type Journey2 = {
  journeyID: string;
  departure: Entry | null;
  arrival: Entry | null;
};
