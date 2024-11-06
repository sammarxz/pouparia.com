import { z } from "zod";

export const getHistoryDataSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  year: z.coerce.number().min(2000).max(2100),
  month: z.coerce.number().min(0).max(11).default(0),
});
