import { collection, endAt, getDocs, orderBy, query, startAt, where } from 'firebase/firestore';
import * as geofire from 'geofire-common';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { StationCard } from '../../components/stations/StationCard';
import { StationMap } from '../../components/stations/StationMap';
import { firestore } from '../../modules/firebase';
import { Station } from '../../types/station';
import { calcDistance } from '../../utils/distance';

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};

const Page: NextPage = () => {
  // map
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 50.107145, lng: 8.663789 });
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
    categories: [] as string[],
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
    if (filters.categories.length) {
      q = query(q, where('stationCategory', 'in', filters.categories));
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
      setStations(stations);
    })();
  }, [stationsQueries]);

  return (
    <div>
      <Head>
        <title>Stations</title>
      </Head>

      <div className="h-[480px] w-full">
        <StationMap
          stations={stations}
          onLoad={setMap}
          onChange={onChangeMap}
          onClickMarker={(stationId) => {
            const station = stations.find((station) => station.stationID === stationId);
            station && setStation(station);
          }}
        />
      </div>

      <section className="h-64 p-4 md:mx-auto md:w-[800px]">
        <div className="mb-4 flex flex-wrap gap-2">
          <div>
            <select
              className="rounded border p-2"
              value={filters.state || ''}
              onChange={(e) => {
                setFilters((filters) => ({ ...filters, state: e.target.value }));
              }}
            >
              <option value={''}>-</option>
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
                <option value={state} key={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="rounded border p-2"
              value={filters.ownerId}
              onChange={(e) => {
                setFilters((filters) => ({ ...filters, ownerId: parseInt(e.target.value, 10) }));
              }}
            >
              <option value={-1}>-</option>
              {[1, 2, 3, 4, 5, 6, 7].map((ownerId) => (
                <option value={ownerId} key={ownerId}>
                  {ownerId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="rounded border p-2"
              value={filters.categories}
              multiple
              onChange={(e) => {
                setFilters((filters) => ({
                  ...filters,
                  categories: Array.from(e.target.selectedOptions).map((option) => option.value),
                }));
              }}
            >
              {['1', '2', '3', '4', '5', '6', '7'].map((category) => (
                <option value={`CATEGORY_${category}`} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {station && (
          <StationCard
            className="border-red-300"
            station={station}
            onClickCenter={() => {
              map?.setCenter({ lat: station.position.lat, lng: station.position.lng });
            }}
          />
        )}
      </section>
    </div>
  );
};

export default Page;
