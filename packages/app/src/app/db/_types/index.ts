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
  zugName: "S 3";
  halte: Halt[];
  himMeldungen: {
    ueberschrift: "Bauarbeiten.";
    text: "Dienstag, 7. Januar 2025 bis Donnerstag, 30. Januar 2025 finden umfangreiche Bauarbeiten zwischen Stellingen und Holstenstraße / Altona statt. Wir fahren in dem Zeitraum nach wie folgt: Die S3 fährt Pinneberg - Stellingen und Altona - Neugraben. Die S5 fährt Sternschanze - Neugraben bzw. Stade. Zwischen Stellingen und Holstenstraße fahren Busse. In Holstenstraße besteht Anschluss an die S2 in Richtung Altona sowie in Richtung Hbf. S2 (7.1. bis 31.1.) : Ausfall 5-Minuten-Takt. Aktuell ist die Station Holstenstraße nicht barrierefrei ausgebaut. Nutzen Sie bitte die Buslinien 20 und 25 ab Holstenstraße nach Altona. Alternative Verbindungen Pinneberg und Altona / Hauptbahnhof: RB/RE.";
    prioritaet: "NIEDRIG";
    modDateTime: "2024-12-30T10:43:18";
  }[];
  risNotizen: [];
  zugattribute: {
    kategorie: "FAHRRADMITNAHME";
    key: "FB";
    value: "Fahrradmitnahme begrenzt möglich";
    teilstreckenHinweis: "(Hamburg-Altona(S) - Hamburg-Neugraben)";
  }[];
  priorisierteMeldungen: Meldung[];
  abfahrtsZeitpunkt: "2025-01-22T12:23:00";
  ankunftsZeitpunkt: "2025-01-22T13:04:00";
  ezAbfahrtsZeitpunkt: "2025-01-22T12:26:00";
  ezAnkunftsZeitpunkt: "2025-01-22T13:05:00";
  cancelled: false;
  polylineGroup: {
    polylineDescriptions: {
      coordinates: {
        lng: 9.934842;
        lat: 53.551276;
      }[];
      delta: false;
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
