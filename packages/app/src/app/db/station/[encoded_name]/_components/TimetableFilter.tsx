"use client";

import classNames from "classnames";
import dayjs from "dayjs";
import type { Route } from "next";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getGermanyDate,
  getGermanyTime,
} from "../../../../../modules/fetch-api/timetable";

type Props = {
  className?: string;
  defaultName: string;
};

export function TimetableFilter({ className, defaultName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [name, setName] = useState(decodeURIComponent(defaultName));
  const [id, setId] = useState(searchParams?.get("id") ?? null);
  const [date, setDate] = useState(searchParams?.get("date") ?? null);
  const [time, setTime] = useState(searchParams?.get("time") ?? null);
  const [trainType, setTrainType] = useState(
    searchParams?.getAll("trainType") ?? [],
  );
  const [type, setType] = useState(searchParams?.get("type") ?? null);
  const [ignoreNullablePlatform] = useState(
    searchParams?.get("ignoreNullablePlatform"),
  );
  const [onlyAccurateStation, setOnlyAccurateStation] = useState(
    searchParams?.get("onlyAccurateStation"),
  );

  useEffect(() => {
    setId(searchParams?.get("id") ?? null);
  }, [searchParams]);

  const search = () => {
    const newQuery = Object.fromEntries(
      Object.entries({
        id,
        date,
        time,
        trainType,
        type,
        ignoreNullablePlatform,
        onlyAccurateStation,
      }).filter(([, value]) => !!value),
    );

    router.replace(
      formatUrl({
        pathname: name ? `/db/station/${encodeURIComponent(name)}` : pathname,
        query: newQuery,
      }),
    );
  };

  const prev1h = () => {
    const newDate = dayjs(
      (date ?? getGermanyDate()) + " " + (time ?? getGermanyTime()),
    ).add(-1, "hour");
    setDate(newDate.format("YYYY-MM-DD"));
    setTime(newDate.format("HH:mm"));
  };

  const next1h = () => {
    const newDate = dayjs(
      (date ?? getGermanyDate()) + " " + (time ?? getGermanyTime()),
    ).add(1, "hour");
    setDate(newDate.format("YYYY-MM-DD"));
    setTime(newDate.format("HH:mm"));
  };

  const prev1d = () => {
    const newDate = dayjs(
      (date ?? getGermanyDate()) + " " + (time ?? getGermanyTime()),
    ).add(-1, "day");
    setDate(newDate.format("YYYY-MM-DD"));
    setTime(newDate.format("HH:mm"));
  };

  const next1d = () => {
    const newDate = dayjs(
      (date ?? getGermanyDate()) + " " + (time ?? getGermanyTime()),
    ).add(1, "day");
    setDate(newDate.format("YYYY-MM-DD"));
    setTime(newDate.format("HH:mm"));
  };

  return (
    <form
      className={classNames(
        "flex flex-col bg-white text-sm [&>*]:border-b [&>*]:border-dashed [&>*]:border-gray-300",
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
            setId("");
          }}
          onBlur={(e) => {
            setName(e.target.value);
          }}
        />
        <button className="bg-gray-200 px-4 py-2 text-center" type="submit">
          Go
        </button>
      </div>
      <div className="grid grid-cols-[1fr_1fr] ">
        <input
          className="w-full bg-transparent px-4 py-2 pr-2"
          type="date"
          name="date"
          value={date ?? getGermanyDate()}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
        <input
          className="w-full bg-transparent px-4 py-2 pr-2"
          type="time"
          name="time"
          value={time ?? getGermanyTime()}
          onChange={(e) => {
            setTime(e.target.value);
          }}
        />
      </div>
      <div className="grid grid-cols-[repeat(5,1fr)] ">
        <button
          className="bg-gray-200 px-4 py-2 text-center"
          type="button"
          onClick={prev1d}
        >
          -1d
        </button>
        <button
          className="bg-gray-200 px-4 py-2 text-center"
          type="button"
          onClick={prev1h}
        >
          -1h
        </button>
        <button
          className="bg-gray-200 px-4 py-2 text-center"
          type="button"
          onClick={() => {
            setDate(null);
            setTime(null);
          }}
        >
          Jetzt
        </button>
        <button
          className="bg-gray-200 px-4 py-2 text-center"
          type="button"
          onClick={next1h}
        >
          +1h
        </button>
        <button
          className="bg-gray-200 px-4 py-2 text-center"
          type="button"
          onClick={next1d}
        >
          +1d
        </button>
      </div>
      <div className="flex">
        {[
          { id: "express", name: "Fern" },
          { id: "train", name: "Regio" },
          { id: "s-bahn", name: "S-Bahn" },
        ].map((currentTrainType) => (
          <label
            className="flex grow items-center py-2 pl-4 pr-2"
            key={currentTrainType.id}
          >
            <input
              className="mr-2"
              type="checkbox"
              name="trainType"
              value={currentTrainType.id}
              checked={trainType.includes(currentTrainType.id)}
              onChange={(e) => {
                const value = e.target.value;
                const newTrainType = [...trainType, value].filter((item) =>
                  item === value ? e.target.checked : true,
                );
                setTrainType(Array.from(new Set(newTrainType)));
              }}
            />
            {currentTrainType.name}
          </label>
        ))}
      </div>
      <div className="flex">
        {[
          { id: "both", name: "Ab/An" },
          { id: "dep", name: "Ab" },
          { id: "arr", name: "An" },
        ].map((currentType) => (
          <label
            className="flex grow items-center py-2 pl-4 pr-2"
            key={currentType.id}
          >
            <input
              className="mr-2"
              type="radio"
              name="type"
              value={currentType.id}
              checked={
                type ? type === currentType.id : "both" === currentType.id
              }
              onChange={(e) => {
                setType(e.target.value);
              }}
            />
            {currentType.name}
          </label>
        ))}
        <label className="flex grow items-center py-2 pl-4 pr-2">
          <input
            className="mr-2"
            type="checkbox"
            name="onlyAccurateStation"
            checked={onlyAccurateStation === "true"}
            onChange={(e) => {
              setOnlyAccurateStation(e.target.checked ? "true" : "false");
            }}
          />
          only acc sta
        </label>
      </div>
    </form>
  );
}
