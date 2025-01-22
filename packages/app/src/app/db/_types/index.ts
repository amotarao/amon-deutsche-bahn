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

export type Hoge =
  | {
      id: "A=1@O=Hamburg-Altona(S)@X=9934555@Y=53551852@U=81@L=8098553@i=U×008006900@";
      abfahrtsZeitpunkt: "2025-01-22T12:23:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:26:00";
      gleis: "1";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg-Altona(S)";
      risNotizen: [];
      bahnhofsInfoId: "2517";
      extId: "8098553";
      routeIdx: 8;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg Königstraße@X=9944092@Y=53547798@U=81@L=8006706@i=U×008001053@";
      abfahrtsZeitpunkt: "2025-01-22T12:25:00";
      ankunftsZeitpunkt: "2025-01-22T12:24:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:28:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:27:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg Königstraße";
      risNotizen: [];
      bahnhofsInfoId: "3357";
      extId: "8006706";
      routeIdx: 9;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg Reeperbahn@X=9957666@Y=53549667@U=81@L=8006705@i=U×008001052@";
      abfahrtsZeitpunkt: "2025-01-22T12:27:00";
      ankunftsZeitpunkt: "2025-01-22T12:26:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:29:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:29:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg Reeperbahn";
      risNotizen: [];
      bahnhofsInfoId: "5167";
      extId: "8006705";
      routeIdx: 10;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg Landungsbrücken@X=9971284@Y=53546135@U=81@L=8003518@i=U×008001051@";
      abfahrtsZeitpunkt: "2025-01-22T12:29:00";
      ankunftsZeitpunkt: "2025-01-22T12:28:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:31:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:31:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg Landungsbrücken";
      risNotizen: [];
      bahnhofsInfoId: "3517";
      extId: "8003518";
      routeIdx: 11;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg Stadthausbrücke@X=9984804@Y=53549461@U=81@L=8005663@i=U×008001050@";
      abfahrtsZeitpunkt: "2025-01-22T12:31:00";
      ankunftsZeitpunkt: "2025-01-22T12:31:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:34:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:33:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg Stadthausbrücke";
      risNotizen: [];
      bahnhofsInfoId: "5955";
      extId: "8005663";
      routeIdx: 12;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg Jungfernstieg@X=9993883@Y=53552193@U=81@L=8003137@i=U×008001049@";
      abfahrtsZeitpunkt: "2025-01-22T12:33:00";
      ankunftsZeitpunkt: "2025-01-22T12:32:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:36:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:34:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg Jungfernstieg";
      risNotizen: [];
      bahnhofsInfoId: "3068";
      extId: "8003137";
      routeIdx: 13;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg Hbf (S-Bahn)@X=10007924@Y=53552805@U=81@L=8098549@i=U×008001020@";
      abfahrtsZeitpunkt: "2025-01-22T12:36:00";
      ankunftsZeitpunkt: "2025-01-22T12:35:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:39:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:38:00";
      gleis: "3";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg Hbf (S-Bahn)";
      risNotizen: [];
      bahnhofsInfoId: "2514";
      extId: "8098549";
      routeIdx: 14;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg-Hammerbrook@X=10023611@Y=53546611@U=81@L=8004266@i=U×008001040@";
      abfahrtsZeitpunkt: "2025-01-22T12:39:00";
      ankunftsZeitpunkt: "2025-01-22T12:38:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:42:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:41:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg-Hammerbrook";
      risNotizen: [];
      bahnhofsInfoId: "2533";
      extId: "8004266";
      routeIdx: 15;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg Elbbrücken@X=10024662@Y=53534826@U=81@L=8002551@i=U×008030476@";
      abfahrtsZeitpunkt: "2025-01-22T12:41:00";
      ankunftsZeitpunkt: "2025-01-22T12:41:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:44:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:43:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg Elbbrücken";
      risNotizen: [];
      bahnhofsInfoId: "8314";
      extId: "8002551";
      routeIdx: 16;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg-Veddel@X=10013309@Y=53521702@U=81@L=8006062@i=U×008001041@";
      abfahrtsZeitpunkt: "2025-01-22T12:44:00";
      ankunftsZeitpunkt: "2025-01-22T12:43:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:46:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:45:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg-Veddel";
      risNotizen: [];
      bahnhofsInfoId: "6399";
      extId: "8006062";
      routeIdx: 17;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg-Wilhelmsburg@X=10007008@Y=53498932@U=81@L=8002561@i=U×008001042@";
      abfahrtsZeitpunkt: "2025-01-22T12:47:00";
      ankunftsZeitpunkt: "2025-01-22T12:46:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:49:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:48:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg-Wilhelmsburg";
      risNotizen: [];
      bahnhofsInfoId: "2523";
      extId: "8002561";
      routeIdx: 18;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg-Harburg(S)@X=9991456@Y=53456962@U=81@L=8098147@i=U×008001043@";
      abfahrtsZeitpunkt: "2025-01-22T12:52:00";
      ankunftsZeitpunkt: "2025-01-22T12:51:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:54:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:53:00";
      gleis: "12";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg-Harburg(S)";
      risNotizen: [];
      bahnhofsInfoId: "2519";
      extId: "8098147";
      routeIdx: 19;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg-Harburg Rathaus@X=9980462@Y=53460692@U=81@L=8004267@i=U×008001726@";
      abfahrtsZeitpunkt: "2025-01-22T12:54:00";
      ankunftsZeitpunkt: "2025-01-22T12:53:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:57:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:55:00";
      gleis: "3";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg-Harburg Rathaus";
      risNotizen: [];
      bahnhofsInfoId: "2556";
      extId: "8004267";
      routeIdx: 20;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg-Heimfeld@X=9963185@Y=53465483@U=81@L=8006749@i=U×008001045@";
      abfahrtsZeitpunkt: "2025-01-22T12:56:00";
      ankunftsZeitpunkt: "2025-01-22T12:55:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T12:58:00";
      ezAnkunftsZeitpunkt: "2025-01-22T12:58:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg-Heimfeld";
      risNotizen: [];
      bahnhofsInfoId: "2662";
      extId: "8006749";
      routeIdx: 21;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg Neuwiedenthal@X=9877437@Y=53473061@U=81@L=8006750@i=U×008001046@";
      abfahrtsZeitpunkt: "2025-01-22T13:01:00";
      ankunftsZeitpunkt: "2025-01-22T13:01:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAbfahrtsZeitpunkt: "2025-01-22T13:03:00";
      ezAnkunftsZeitpunkt: "2025-01-22T13:03:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg Neuwiedenthal";
      risNotizen: [];
      bahnhofsInfoId: "4465";
      extId: "8006750";
      routeIdx: 22;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    }
  | {
      id: "A=1@O=Hamburg-Neugraben@X=9852052@Y=53474140@U=81@L=8002557@i=U×008001186@";
      ankunftsZeitpunkt: "2025-01-22T13:04:00";
      auslastungsmeldungen: [
        {
          klasse: "KLASSE_1";
          stufe: 0;
        },
        {
          klasse: "KLASSE_2";
          stufe: 0;
        },
      ];
      ezAnkunftsZeitpunkt: "2025-01-22T13:05:00";
      gleis: "2";
      platformType: {
        code: "PL";
        shortDescription: "Gl.";
        longDescription: "Gleis";
        translations: {
          en: {
            shortDescription: "Pl.";
            longDescription: "Track";
          };
          fr: {
            shortDescription: "";
          };
          it: {
            shortDescription: "";
          };
          cs: {
            shortDescription: "";
          };
          da: {
            shortDescription: "";
          };
          es: {
            shortDescription: "";
          };
          nl: {
            shortDescription: "";
          };
          pl: {
            shortDescription: "";
          };
        };
      };
      name: "Hamburg-Neugraben";
      risNotizen: [];
      bahnhofsInfoId: "2520";
      extId: "8002557";
      routeIdx: 23;
      priorisierteMeldungen: [];
      adminID: "0S";
      kategorie: "S";
      nummer: "43115";
    };
