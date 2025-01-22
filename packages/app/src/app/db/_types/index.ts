export type StationTimetableResponse = {
  ort: Ort;
  journeys: Journey[];
};

export type TrainTimetableResponse = {
  fahrt: Fahrt;
};

export type Ort = {
  extId: string;
  id: string;
  lat: number;
  lon: number;
  name: string;
  products: string[];
  type: string;
};

export type Abfahrt = {
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

export type Ankunft = {
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
  abfahrt: Abfahrt | null;
  ankunft: Ankunft | null;
};

export type Fahrt = {
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
