import useSWRInfinite from "swr/infinite";
import type { ApiResponse } from "../_types";
import { fetchBoard } from "../actions";

export type FetchApiParams = {
  stationCode: string;
  dateUnix: number;
};

export const fetchApi = async ({
  stationCode,
  dateUnix,
}: FetchApiParams): Promise<ApiResponse> => {
  const url = new URL("/uk/station/api", process.env.NEXT_PUBLIC_BASE_URL);

  url.searchParams.set("station-code", stationCode);
  url.searchParams.set("date-unix", dateUnix.toString());

  const res = await fetch(url);
  const data = (await res.json()) as ApiResponse;
  return data;
};

export function useApiSWRInfinite({ stationCode, dateUnix }: FetchApiParams) {
  const swr = useSWRInfinite<ApiResponse>(
    (_, previousPageData) => {
      if (previousPageData && !previousPageData.nextDateUnix) return null;
      return [
        fetchBoard,
        {
          stationCode,
          dateUnix: previousPageData?.nextDateUnix ?? dateUnix,
        },
      ];
    },
    ([fetchBoard, params]) => fetchBoard(params),
  );
  return {
    ...swr,
    data: swr.data?.at(0) ?? null,
    services: (swr.data?.flatMap((page) => page.services) ?? [])
      .filter(
        (service, i, self) =>
          self.findIndex((s) => s.rid === service.rid) === i,
      )
      .toSorted((a, z) => {
        const aDate =
          a.arrivalInfo?.scheduled ?? a.departureInfo?.scheduled ?? "0";
        const zDate =
          z.arrivalInfo?.scheduled ?? z.departureInfo?.scheduled ?? "0";
        return new Date(aDate).getTime() - new Date(zDate).getTime();
      }),
  };
}
