import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fetch from 'node-fetch';

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const single = async (offset) => {
  const res = await fetch(`https://apis.deutschebahn.com/db-api-marketplace/apis/ris-stations/v1/stations?offset=${offset}`, {
    headers: {
      'DB-Client-Id': process.env.DB_CLIENT_ID,
      'DB-Api-Key': process.env.DB_API_KEY,
    },
  });
  const json = await res.json();

  const bulkWriter = db.bulkWriter();
  json.stations.forEach((station) => {
    bulkWriter.set(db.collection('stations').doc(station.stationID), station);
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
