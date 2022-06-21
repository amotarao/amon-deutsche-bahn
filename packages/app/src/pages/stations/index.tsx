import { collection, doc, endAt, getDocs, orderBy, Query, query, startAt, updateDoc, where } from 'firebase/firestore';
import * as geofire from 'geofire-common';
import debounce from 'lodash.debounce';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { SearchPlaces } from '../../components/stations/SearchPlaces';
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
    const distanceFromCenter = Math.min((distance * 1000) / 2);
    setDistance(distanceFromCenter);
  }, [map]);

  // filters
  const [filters, setFilters] = useState({
    categories: [] as string[],
  });

  // stations
  const [station, setStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const stationsQueries = useMemo(() => {
    let q = query(collection(firestore, 'stations'));
    const maxDistance = 20000;

    if (filters.categories.length) {
      q = query(q, where('dbRisStationCateogry', 'in', filters.categories));
    }

    const bounds = geofire.geohashQueryBounds([center.lat, center.lng], Math.min(distance, maxDistance));
    return bounds.map(([start, end]) => {
      return query(q, orderBy('position.geohash'), startAt(start), endAt(end));
    });
  }, [center, distance, filters]);
  const fetchStations = useMemo(
    () =>
      debounce(async (queries: Query[]) => {
        const stations: Station[] = [];
        await Promise.all(
          queries.map(async (q) => {
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => doc.data() as Station);
            stations.push(...data);
          })
        );
        setStations(stations);
      }, 500),
    []
  );
  useEffect(() => {
    fetchStations(stationsQueries);
  }, [fetchStations, stationsQueries]);

  type Position = {
    lat: number;
    lng: number;
    placeId: string;
  };
  const [position, setPosition] = useState<Position | null>();
  const onClickMap = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    const placeId = (e as any).placeId as string | undefined;
    if (lat !== undefined && lng !== undefined && placeId) {
      setPosition({ lat, lng, placeId });
    }
  };

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
          onClick={onClickMap}
          onClickMarker={(stationId) => {
            const station = stations.find((station) => station.dbRisStationId === stationId);
            station && setStation(station);
          }}
        />
      </div>

      <section className="flex h-64 flex-col gap-4 p-4 md:mx-auto md:w-[800px]">
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-col gap-2">
            <p>Station Categories</p>
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
                  Category {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="rounded border px-2 py-1"
            onClick={() => {
              map?.setCenter({ lat: 0, lng: 0 });
            }}
          >
            Center: 0, 0
          </button>
        </div>
        {station && <StationCard station={station} />}
        <SearchPlaces
          onClickCenter={(lat, lng) => {
            map?.setCenter({ lat, lng });
          }}
          onClickSetPosition={({ lat, lng, placeId }) => {
            if (!station) {
              return;
            }
            const docRef = doc(collection(firestore, 'stations'), station.dbRisStationId);
            const geohash = geofire.geohashForLocation([lat, lng]);
            const data = { position: { geohash, lat, lng }, googleMapsPlaceId: placeId };
            updateDoc(docRef, data);
          }}
        />
        {position && (
          <div className="flex flex-col gap-2 rounded border p-2">
            <p className="text-sm">Place ID: {position.placeId}</p>
            <p className="text-sm">
              LatLng: {position.lat}, {position.lng}
            </p>
            <div className="flex gap-2">
              {station && !station.googleMapsPlaceId && (
                <button
                  className="block rounded border border-slate-300 px-2 py-0.5"
                  onClick={() => {
                    const docRef = doc(collection(firestore, 'stations'), station.dbRisStationId);
                    const { lat, lng, placeId } = position;
                    const geohash = geofire.geohashForLocation([lat, lng]);
                    const data = { position: { geohash, lat, lng }, googleMapsPlaceId: placeId };
                    updateDoc(docRef, data);
                  }}
                >
                  Set Data
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
