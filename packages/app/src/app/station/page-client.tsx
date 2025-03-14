"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { SearchBox } from "./_components/SearchBox";
import { fetchStationSearch } from "./actions";

export function PageClient() {
  return (
    <div>
      <SearchBox className="sticky top-0 mb-4" />
      <Main />
    </div>
  );
}

type MainProps = {
  className?: string;
};

function Main({ className }: MainProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const { data, isLoading } = useSWR(query || null, (query) =>
    fetchStationSearch({ query }),
  );

  if (!query) {
    return null;
  }

  if (isLoading) {
    return <p className="px-4 py-2 text-sm">Fetching</p>;
  }

  if (!data) {
    return <p className="px-4 py-2 text-sm">No Data</p>;
  }

  return (
    <main className={className}>
      <div className="flex flex-col gap-2">
        <ul>
          {data.map((station) => (
            <li key={station.value} className="px-4 py-1">
              <Link
                className="text-xs underline"
                href={`/db/station/${station.text}`}
              >
                {station.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
