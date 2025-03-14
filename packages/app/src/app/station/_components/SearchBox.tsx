"use client";

import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  className?: string;
};

export function SearchBox({ className }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") ?? "");

  const search = () => {
    const url = new URL("/station", location.href);
    url.searchParams.set("query", query);
    router.replace(url.href.replace(url.origin, ""));
  };

  return (
    <form
      className={classNames(
        "flex flex-col bg-white dark:bg-slate-900 text-sm *:border-b *:border-dashed *:border-gray-300 dark:*:border-slate-600",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        search();
      }}
    >
      <div className="grid grid-cols-[1fr_auto]">
        <input
          className="w-full px-4 py-2"
          type="text"
          name="name"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onBlur={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button
          className="bg-gray-200 dark:bg-slate-700 px-4 py-2 text-center"
          type="submit"
        >
          Go
        </button>
      </div>
    </form>
  );
}
