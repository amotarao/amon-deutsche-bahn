import { useState } from 'react';
import { PlacesAPIResponse } from '../../pages/api/google/searchPlaces';

export type SearchPlacesProps = {
  onClickCenter?: (lat: number, lng: number) => void;
  onClickSetPosition?: (position: { placeId: string; lat: number; lng: number }) => void;
};

export const SearchPlaces: React.FC<SearchPlacesProps> = ({ onClickCenter, onClickSetPosition }) => {
  const [keyword, setKeyword] = useState('');
  const [res, setRes] = useState<PlacesAPIResponse | null>(null);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const url = new URL(`${location.origin}/api/google/searchPlaces`);
          url.searchParams.set('keyword', keyword + ' bahnhof');
          fetch(url)
            .then((res) => res.json())
            .then((res) => {
              setRes(res as PlacesAPIResponse);
            });
        }}
      >
        <input
          className="rounded border px-4 py-2"
          type="search"
          name="keyword"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
      </form>
      {res?.candidates.map((candidate) => {
        return (
          <div className="flex flex-col gap-2 rounded border p-2" key={candidate.place_id}>
            <p className="text-sm">{candidate.place_id}</p>
            <p className="text-sm">{candidate.name}</p>
            <div className="flex gap-2">
              <button
                className="w-max rounded border px-2 py-1"
                onClick={() => {
                  onClickCenter && onClickCenter(candidate.geometry.location.lat, candidate.geometry.location.lng);
                }}
              >
                Center: {candidate.geometry.location.lat}, {candidate.geometry.location.lng}
              </button>
              <button
                className="w-max rounded border px-2 py-1"
                onClick={() => {
                  onClickSetPosition &&
                    onClickSetPosition({
                      placeId: candidate.place_id,
                      lat: candidate.geometry.location.lat,
                      lng: candidate.geometry.location.lng,
                    });
                }}
              >
                Set Position
              </button>
            </div>
          </div>
        );
      }) ?? null}
    </>
  );
};
