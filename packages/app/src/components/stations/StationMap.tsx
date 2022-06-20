import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import debounce from 'lodash.debounce';
import React, { useCallback, useState, useMemo } from 'react';
import { Station } from '../../types/station';

export type StationMapProps = {
  stations: Station[];
  onLoad?: (map: google.maps.Map) => void;
  onChange?: () => void;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onClickMarker?: (stationId: string) => void;
};

export const StationMap: React.FC<StationMapProps> = ({
  stations,
  onClick,
  onLoad: onLoadToParent,
  onChange: onChangeToParent,
  onClickMarker,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const center = useMemo(
    () => ({
      lat: 50.107145,
      lng: 8.663789,
    }),
    []
  );

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      onLoadToParent && onLoadToParent(map);
    },
    [onLoadToParent]
  );
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onChange = debounce(() => {
    onChangeToParent && onChangeToParent();
  }, 300);

  if (!isLoaded) {
    return null;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={12}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
      }}
      onClick={onClick}
      onBoundsChanged={onChange}
      onCenterChanged={onChange}
      onZoomChanged={onChange}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {stations.map((station) => {
        const categoryNumber = parseInt(station.dbRisStationCateogry.replace(/^CATEGORY_/, '') ?? '7', 10);
        const label = { 1: '1', 2: '2', 3: '3', 4: '4', 5: '', 6: '', 7: '' }[categoryNumber];
        const opacity = { 1: 1, 2: 0.9, 3: 0.8, 4: 0.6, 5: 0.4, 6: 0.4, 7: 0.4 }[categoryNumber];

        return (
          <Marker
            key={station.dbRisStationId}
            title={station.name}
            label={label}
            opacity={opacity}
            zIndex={opacity}
            position={{ lat: station.position.lat, lng: station.position.lng }}
            onClick={() => {
              onClickMarker && onClickMarker(station.dbRisStationId);
            }}
          />
        );
      })}
    </GoogleMap>
  );
};
