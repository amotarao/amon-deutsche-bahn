"use client";

import classNames from "classnames";
import type { Route } from "next";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getGermanyDate,
  getGermanyTime,
} from "../../modules/fetch-api/timetable";

export type TimetableFilterProps = {
  className?: string;
  name: string;
};

export const TimetableFilter: React.FC<TimetableFilterProps> = ({
  className,
  name: defaultName,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [name, setName] = useState(decodeURIComponent(defaultName));
  const [id, setId] = useState(
    searchParams?.has("id") ? searchParams.get("id") || undefined : undefined,
  );
  const [date, setDate] = useState(
    searchParams?.has("date")
      ? searchParams.get("date") || undefined
      : undefined,
  );
  const [time, setTime] = useState(
    searchParams?.has("time")
      ? searchParams.get("time") || undefined
      : undefined,
  );
  const [trainType, setTrainType] = useState(
    searchParams?.has("trainType")
      ? searchParams.getAll("trainType") || []
      : [],
  );
  const [type, setType] = useState(
    searchParams?.has("type")
      ? searchParams.get("type") || undefined
      : undefined,
  );
  const [ignoreNullablePlatform] = useState(
    searchParams?.has("ignoreNullablePlatform")
      ? searchParams.get("ignoreNullablePlatform") || undefined
      : undefined,
  );
  const [onlyAccurateStation, setOnlyAccurateStation] = useState(
    searchParams?.has("onlyAccurateStation")
      ? searchParams.get("onlyAccurateStation") || undefined
      : undefined,
  );

  useEffect(() => {
    setId(
      searchParams?.has("id") ? searchParams.get("id") || undefined : undefined,
    );
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
        pathname: name
          ? `/timetable/stations/${encodeURIComponent(name)}`
          : pathname,
        query: newQuery,
      }) as Route,
    );
  };

  return (
    <div
      className={classNames(
        "flex flex-col bg-white text-sm [&>*]:border-b [&>*]:border-dashed [&>*]:border-gray-300",
        className,
      )}
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
          onKeyDown={(e) => {
            if (e.key !== "Enter") {
              return;
            }
          }}
          onBlur={(e) => {
            setName(e.target.value);
          }}
        />
        <button
          className="bg-gray-200 px-4 py-2 text-center"
          type="button"
          onClick={() => {
            search();
          }}
        >
          Go
        </button>
      </div>
      <div className="grid grid-cols-[1fr_1fr_auto] ">
        <input
          className="w-full bg-transparent px-4 py-2 pr-2"
          type="date"
          name="date"
          value={date || getGermanyDate()}
          onChange={(e) => {
            setDate(e.target.value);
          }}
        />
        <input
          className="w-full bg-transparent px-4 py-2 pr-2"
          type="time"
          name="time"
          value={time || getGermanyTime()}
          onChange={(e) => {
            setTime(e.target.value);
          }}
        />
        <button
          className="bg-gray-200 px-4 py-2 text-center"
          type="button"
          onClick={() => {
            setDate(undefined);
            setTime(undefined);
          }}
        >
          Now
        </button>
      </div>
      <div className="flex">
        {[
          { id: "express", name: "Express" },
          { id: "train", name: "Train" },
          { id: "s-bahn", name: "S-Bahn" },
        ].map((curretTrainType) => (
          <label
            className="flex grow items-center py-2 pl-4 pr-2"
            key={curretTrainType.id}
          >
            <input
              className="mr-2"
              type="checkbox"
              name="trainType"
              value={curretTrainType.id}
              checked={trainType.includes(curretTrainType.id)}
              onChange={(e) => {
                const value = e.target.value;
                const newTrainType = [...trainType, value].filter((item) =>
                  item === value ? e.target.checked : true,
                );
                setTrainType(Array.from(new Set(newTrainType)));
              }}
            />
            {curretTrainType.name}
          </label>
        ))}
      </div>
      <div className="flex">
        {[
          { id: "both", name: "Both" },
          { id: "dep", name: "Dep" },
          { id: "arr", name: "Arr" },
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
    </div>
  );
};
