export type StationTimetableResponse = {
  ort: Place;
  journeys: Journey[];
};

export type TrainTimetableResponse = {
  fahrt: Route;
};

export type Place = {
  extId: string;
  id: string;
  lat: number;
  lon: number;
  name: string;
  products: string[];
  type: string;
};

export type Departure = {
  bahnhofsId: string;
  zeit: string;
  ezZeit?: string;
  gleis?: string;
  ezGleis?: string;
  ueber: string[];
  journeyId: string;
  meldungen: Meldung[];
  verkehrmittel: Verkehrmittel;
  terminus: string;
};

export type Arrival = {
  bahnhofsId: string;
  zeit: string;
  ezZeit?: string;
  gleis?: string;
  ezGleis?: string;
  ueber: string[];
  journeyId: string;
  meldungen: Meldung[];
  verkehrmittel: Verkehrmittel;
  terminus?: string;
};

export type Meldung = {
  prioritaet: MeldungPrioritaet;
  text: string;
  type?: "HALT_AUSFALL" | string;
};

export type MeldungPrioritaet = "HOCH" | "NIEDRIG" | string;

export type Verkehrmittel = {
  name: string;
  linienNummer?: string;
  kurzText: string;
  mittelText: string;
  langText: string;
  produktGattung: ProduktGattung;
};

export type ProduktGattung =
  | "ICE"
  | "EC_IC"
  | "IR"
  | "REGIONAL"
  | "SBAHN"
  | "BUS"
  | "SCHIFF"
  | "TRAM"
  | "ANRUFPFLICHTIG"
  | "UBAHN";

export type Journey = {
  journeyId: string;
  departure: Departure | null;
  arrival: Arrival | null;
};

export type Route = {
  reisetag: string;
  regulaereVerkehrstage: string;
  irregulaereVerkehrstage: string;
  zugName: string;
  halte: Halt[];
  himMeldungen: {
    ueberschrift: string;
    text: string;
    prioritaet: MeldungPrioritaet;
    modDateTime: string;
  }[];
  risNotizen: [];
  zugattribute: {
    kategorie: string;
    key: string;
    value: string;
    teilstreckenHinweis: string;
  }[];
  priorisierteMeldungen: Meldung[];
  abfahrtsZeitpunkt: string;
  ankunftsZeitpunkt: string;
  ezAbfahrtsZeitpunkt: string;
  ezAnkunftsZeitpunkt: string;
  cancelled: boolean;
  polylineGroup: {
    polylineDescriptions: {
      coordinates: {
        lng: number;
        lat: number;
      }[];
      delta: boolean;
    }[];
  };
};

export type Halt = {
  id: string;
  extId: string;
  name: string;
  gleis?: string;
  ezGleis?: string;
  ankunftsZeitpunkt?: string;
  abfahrtsZeitpunkt?: string;
  ezAnkunftsZeitpunkt?: string;
  ezAbfahrtsZeitpunkt?: string;
  priorisierteMeldungen: Meldung[];
};
