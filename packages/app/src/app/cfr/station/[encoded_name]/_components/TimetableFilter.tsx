"use client";

import classNames from "classnames";
import dayjs from "dayjs";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getRomaniaDate } from "../../../_lib/time";

type Props = {
  className?: string;
  name: string;
};

export function TimetableFilter({ className, name: defaultName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [name, setName] = useState(decodeURIComponent(defaultName));
  const [date, setDate] = useState(searchParams?.get("date") ?? null);

  const search = () => {
    const newQuery = Object.fromEntries(
      Object.entries({
        date,
      }).filter(([, value]) => !!value),
    );

    router.replace(
      formatUrl({
        pathname: name ? `/cfr/station/${encodeURIComponent(name)}` : pathname,
        query: newQuery,
      }),
    );
  };

  const prev1d = () => {
    const newDate = dayjs(date ?? getRomaniaDate()).add(-1, "day");
    setDate(newDate.format("YYYY-MM-DD"));
  };

  const next1d = () => {
    const newDate = dayjs(date ?? getRomaniaDate()).add(1, "day");
    setDate(newDate.format("YYYY-MM-DD"));
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
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={(e) => {
            setName(e.target.value);
          }}
        />
        <button
          className="bg-gray-200 dark:bg-slate-700 px-4 py-2 text-center"
          type="submit"
        >
          Go
        </button>
      </div>
      <div className="grid grid-cols-[repeat(4,1fr)] ">
        <input
          className="w-full bg-transparent px-4 py-2 pr-2 dark:[color-scheme:dark]"
          type="date"
          name="date"
          value={date ?? getRomaniaDate()}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
        <button
          className="bg-gray-200 dark:bg-slate-700 px-4 py-2 text-center"
          type="button"
          onClick={prev1d}
        >
          -1d
        </button>
        <button
          className="bg-gray-200 dark:bg-slate-700 px-4 py-2 text-center"
          type="button"
          onClick={() => {
            setDate(null);
          }}
        >
          Now
        </button>
        <button
          className="bg-gray-200 dark:bg-slate-700 px-4 py-2 text-center"
          type="button"
          onClick={next1d}
        >
          +1d
        </button>
      </div>
    </form>
  );
}
