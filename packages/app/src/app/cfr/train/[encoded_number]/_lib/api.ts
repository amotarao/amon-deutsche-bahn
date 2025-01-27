import type { ReadonlyURLSearchParams } from "next/navigation";
import type { ApiResponse } from "../_types";

export const fetchApi = async (
  number: string,
  searchParams?: ReadonlyURLSearchParams | null,
): Promise<ApiResponse> => {
  const url = new URL(
    `/cfr/train/${encodeURIComponent(number)}/api`,
    process.env.NEXT_PUBLIC_BASE_URL,
  );

  const date = searchParams?.get("date");
  if (date) {
    url.searchParams.set("date", date);
  }

  const res = await fetch(url);
  const data = (await res.json()) as ApiResponse;
  return data;
};
