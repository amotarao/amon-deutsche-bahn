import { z } from "zod";

export type Params = {
  query: string;
};

export const responseSchema = z
  .object({
    extId: z.string(),
    id: z.string(),
    lat: z.number(),
    lon: z.number(),
    name: z.string(),
    products: z.string().array(),
    type: z.string(),
  })
  .array();

export type Response = z.infer<typeof responseSchema>;
