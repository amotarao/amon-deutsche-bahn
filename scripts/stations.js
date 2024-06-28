import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as geofire from "geofire-common";

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const single = async (offset) => {
  const res = await fetch(
    `https://apis.deutschebahn.com/db-api-marketplace/apis/ris-stations/v1/stations?offset=${offset}`,
    {
      headers: {
        "DB-Client-Id": process.env.DB_CLIENT_ID,
        "DB-Api-Key": process.env.DB_API_KEY,
      },
    },
  );
  const json = await res.json();

  const bulkWriter = db.bulkWriter();
  json.stations.forEach((station) => {
    const lat = station.position ? station.position.latitude : 0;
    const lng = station.position ? station.position.longitude : 0;
    const geohash = geofire.geohashForLocation([lat, lng]);

    const data = {
      name: station.names.DE.name,
      googleMapsPlaceId: "",
      dbRisStationId: station.stationID,
      dbRisStationCateogry: station.stationCategory || "",
      position: { geohash, lat, lng },
    };
    const ref = db.collection("stations").doc(station.stationID);
    bulkWriter.set(ref, data);

    const subRef = db
      .collection("stations")
      .doc(station.stationID)
      .collection("db_ris")
      .doc("db_ris");
    bulkWriter.set(subRef, station);
  });
  await bulkWriter.close();
};

const run = async () => {
  const offsets = new Array(57).fill(0).map((_, i) => i * 100);
  for await (const offset of offsets) {
    await single(offset);
  }
};

run();
