import { z } from "zod";

export type Params = {
  query: string;
};

export const responseSchema = z
  .object({
    text: z.string(),
    description: z.string(),
    value: z.string(),
    favorite: z.null(),
    iconId: z.number(),
    selectedText: z.string(),
    itm: z.null(),
    type: z.null(),
  })
  .array();

export type Response = z.infer<typeof responseSchema>;
