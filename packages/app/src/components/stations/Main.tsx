'use client';

import { MarkerProps } from '@react-google-maps/api';
import { collection, endAt, getDocs, orderBy, Query, query, startAt, where } from 'firebase/firestore';
import * as geofire from 'geofire-common';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { StationCard } from '../../components/stations/StationCard';
import { StationMap } from '../../components/stations/StationMap';
import { firestore } from '../../modules/firebase';
import { Station } from '../../types/station';
import { calcDistance } from '../../utils/distance';

export type MainProps = {
  className?: string;
};

export const Main: React.FC<MainProps> = ({ className }) => {
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
  const [filters] = useState({
    categories: [] as string[],
  });

  // stations
  const [station, setStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const markers = useMemo<(MarkerProps & { key: string })[]>(() => {
    return stations.map((station) => {
      const categoryNumber = parseInt(station.dbRisStationCateogry.replace(/^CATEGORY_/, '') ?? '7', 10);
      const label = { 1: '1', 2: '2', 3: '3', 4: '4', 5: '', 6: '', 7: '' }[categoryNumber];
      const opacity = { 1: 1, 2: 0.9, 3: 0.8, 4: 0.6, 5: 0.4, 6: 0.4, 7: 0.4 }[categoryNumber];
      return {
        key: station.dbRisStationId,
        title: station.name,
        label: label,
        opacity: opacity,
        zIndex: opacity,
        position: { lat: station.position.lat, lng: station.position.lng },
      };
    });
  }, [stations]);
  const stationsQueries = useMemo(() => {
    let q = query(collection(firestore, 'stations'));
    const maxDistance = 10000;

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
  const [, setPosition] = useState<Position | null>();
  const onClickMap = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    const placeId = 'placeId' in e && e.placeId && typeof e.placeId === 'string' ? e.placeId : undefined;
    if (lat !== undefined && lng !== undefined && placeId) {
      setPosition({ lat, lng, placeId });
    }
  };

  return (
    <div className={className}>
      <div className="relative h-screen w-full">
        <StationMap
          markers={markers}
          onLoad={setMap}
          onChange={onChangeMap}
          onClick={onClickMap}
          onClickMarker={(stationId) => {
            const station = stations.find((station) => station.dbRisStationId === stationId);
            station && setStation(station);
          }}
        />
        {station && (
          <div className="absolute bottom-0 left-0 h-1/2 w-full rounded-t-2xl bg-white p-4 shadow-lg">
            <button
              className="absolute right-2 top-2"
              onClick={() => {
                setStation(null);
              }}
            >
              ×
            </button>
            <StationCard station={station} />
          </div>
        )}
      </div>
    </div>
  );
};
