"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

import { SearchBox } from "./_components/SearchBox";
import { fetchCdStationSearch, fetchDbStationSearch } from "./actions";

export function PageClient() {
  return (
    <div>
      <SearchBox className="sticky top-0 mb-4" />
      <Main />
    </div>
  );
}

function Main() {
  return (
    <main>
      <div className="grid grid-cols-1 gap-8">
        <Cd key="cd" />
        <Db key="db" />
      </div>
    </main>
  );
}

function Cd() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const { data, isLoading } = useSWR(
    query ? [fetchCdStationSearch, query] : null,
    ([fetchCdStationSearch, query]) => fetchCdStationSearch({ query }),
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
    <section className="grid grid-cols-1 gap-2">
      <h2 className="font-bold px-4 text-xs">CD</h2>
      <ul className="grid grid-cols-1 gap-2">
        {data.map((station) => (
          <li key={station.value} className="px-4">
            <p className="text-xs">
              <Link className="underline" href={`/db/station/${station.text}`}>
                {station.text} ({station.value})
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Db() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const { data, isLoading } = useSWR(
    query ? [fetchDbStationSearch, query] : null,
    ([fetchDbStationSearch, query]) => fetchDbStationSearch({ query }),
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
    <section className="grid grid-cols-1 gap-2">
      <h2 className="font-bold px-4 text-xs">DB</h2>
      <ul className="grid grid-cols-1 gap-2">
        {data.map((station) => (
          <li key={station.extId} className="px-4">
            <p className="text-xs">
              <Link className="underline" href={`/db/station/${station.name}`}>
                {station.name} ({station.extId})
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
