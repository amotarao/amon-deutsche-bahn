export type Response = {
  ort: Ort;
  journeys: Journey[];
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
