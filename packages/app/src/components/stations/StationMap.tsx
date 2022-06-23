import { GoogleMap, Marker, MarkerProps, useJsApiLoader } from '@react-google-maps/api';
import debounce from 'lodash.debounce';
import React, { useCallback, useState, useMemo } from 'react';

export type StationMapProps = {
  markers: (MarkerProps & { key: string })[];
  onLoad?: (map: google.maps.Map) => void;
  onChange?: () => void;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onClickMarker?: (stationId: string) => void;
};

export const StationMap: React.FC<StationMapProps> = ({
  markers,
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
    <>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: false,
        }}
        onClick={onClick}
        onBoundsChanged={onChange}
        onCenterChanged={onChange}
        onZoomChanged={onChange}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map(({ key, ...marker }) => {
          return (
            <Marker
              key={key}
              {...marker}
              onClick={() => {
                onClickMarker && onClickMarker(key);
              }}
            />
          );
        })}
      </GoogleMap>
      <button
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full bg-slate-700 text-white"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude: lat, longitude: lng } = position.coords;
              map?.setCenter({ lat, lng });
            },
            (error) => {
              console.error(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            }
          );
        }}
      >
        loc
      </button>
    </>
  );
};
