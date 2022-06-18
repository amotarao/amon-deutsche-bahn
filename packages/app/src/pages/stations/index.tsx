import { collection, endAt, getDocs, limit, orderBy, query, startAt, where } from 'firebase/firestore';
import * as geofire from 'geofire-common';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { StationMap } from '../../components/stations/StationMap';
import { calcDistance } from '../../utils/distance';
import { firestore } from '../modules/firebase';
import { Station } from '../types/station';

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};

const Page: NextPage = () => {
  // map
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState(1000);
  const onChangeMap = useCallback(() => {
    const bounds = map?.getBounds();
    if (!bounds) {
      return;
    }
    setCenter({ lat: bounds.getCenter().lat(), lng: bounds.getCenter().lng() });
    const distance = calcDistance(
      bounds.getNorthEast().lat(),
      bounds.getNorthEast().lng(),
      bounds.getSouthWest().lat(),
      bounds.getSouthWest().lng()
    );
    const distanceFromCenter = Math.min((distance * 1000) / 2, 20000);
    setDistance(distanceFromCenter);
  }, [map]);

  // filters
  const [filters, setFilters] = useState({
    state: '',
    ownerId: -1,
    category: '',
  });

  // stations
  const [station, setStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const stationsQueries = useMemo(() => {
    let q = query(collection(firestore, 'stations'));
    if (filters.state) {
      q = query(q, where('address.state', '==', filters.state));
    }
    if (filters.ownerId > -1) {
      q = query(q, where('owner.organisationalUnit.id', '==', filters.ownerId));
    }
    if (filters.category) {
      q = query(q, where('stationCategory', '==', filters.state));
    }

    if (!center) {
      q = query(q, limit(100));
      return [q];
    }

    const bounds = geofire.geohashQueryBounds([center.lat, center.lng], distance);
    return bounds.map(([start, end]) => {
      return query(q, orderBy('position.geohash'), startAt(start), endAt(end));
    });
  }, [center, distance, filters]);
  useEffect(() => {
    (async () => {
      const stations: Station[] = [];
      await Promise.all(
        stationsQueries.map(async (q) => {
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => doc.data() as Station);
          stations.push(...data);
        })
      );
      console.log(stations.length);
      setStations(stations);
    })();
  }, [stationsQueries]);

  return (
    <div>
      <Head>
        <title>Stations</title>
      </Head>

      <StationMap
        stations={stations}
        onLoad={setMap}
        onChange={onChangeMap}
        onClickMarker={(stationId) => {
          const station = stations.find((station) => station.stationID === stationId);
          station && setStation(station);
        }}
      />

      <section className="mx-4 h-64 overflow-y-auto md:mx-auto md:w-[800px]">
        <div>
          <div>
            <select
              defaultValue={''}
              onChange={(e) => {
                setFilters((filters) => ({ ...filters, state: e.target.value }));
              }}
            >
              <option value={''} selected={filters.state === null}>
                -
              </option>
              {[
                'Nordrhein-Westfalen',
                'Baden-Württemberg',
                'Bayern',
                'Niedersachsen',
                'Sachsen',
                'Schleswig-Holstein',
                'Berlin',
                'Brandenburg',
                'Rheinland-Pfalz',
                'Hessen',
                'Hamburg',
                'Mecklenburg-Vorpommern',
                'Thüringen',
                'Sachsen-Anhalt',
                'Saarland',
                'Schweiz CH',
                'Bremen',
              ].map((state) => (
                <option value={state} selected={filters.state === state} key={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              defaultValue={-1}
              onChange={(e) => {
                setFilters((filters) => ({ ...filters, ownerId: parseInt(e.target.value, 10) }));
              }}
            >
              <option value={-1} selected={filters.ownerId === null}>
                -
              </option>
              {[1, 2, 3, 4, 5, 6, 7].map((ownerId) => (
                <option value={ownerId} selected={filters.ownerId === ownerId} key={ownerId}>
                  {ownerId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              defaultValue={''}
              onChange={(e) => {
                setFilters((filters) => ({ ...filters, category: e.target.value }));
              }}
            >
              <option value={''} selected={filters.category === null}>
                -
              </option>
              {['CATEGORY_1', 'CATEGORY_2', 'CATEGORY_3', 'CATEGORY_4', 'CATEGORY_5', 'CATEGORY_6', 'CATEGORY_7'].map(
                (category) => (
                  <option value={category} selected={filters.category === category} key={category}>
                    {category}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {station && (
          <div className="border border-red-300">
            <p>ID: {station.stationID}</p>
            <p>Name: {station.name}</p>
            <p>
              LatLng: {station.position.lat} / {station.position.lng}
            </p>
            <div className="flex gap-2">
              <button
                className="rounded-sm border border-slate-300 px-2 py-0.5"
                onClick={() => {
                  map?.setCenter({ lat: station.position.lat, lng: station.position.lng });
                }}
              >
                Center
              </button>
              <Link href={`/timetable/stations/${station.name}`}>
                <a className="block rounded-sm border border-slate-300 px-2 py-0.5">Timetable</a>
              </Link>
            </div>
          </div>
        )}

        <ul className="flex flex-col gap-2">
          {stations.map((station) => (
            <li key={station.stationID}>
              <div>
                <p>ID: {station.stationID}</p>
                <p>Name: {station.name}</p>
                <p>
                  LatLng: {station.position.lat} / {station.position.lng}
                </p>
                <div className="flex gap-2">
                  <button
                    className="rounded-sm border border-slate-300 px-2 py-0.5"
                    onClick={() => {
                      map?.setCenter({ lat: station.position.lat, lng: station.position.lng });
                    }}
                  >
                    Center
                  </button>
                  <Link href={`/timetable/stations/${station.name}`}>
                    <a className="block rounded-sm border border-slate-300 px-2 py-0.5">Timetable</a>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Page;
