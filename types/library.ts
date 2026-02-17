import { z } from "zod";


export enum LibraryStatus {
  READING = "reading",
  COMPLETED = "completed",
  PLAN_TO_READ = "plan_to_read"
}

// library schema
export const LibrarySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  created_at: z.string(),
});

export const LibraryItemSchema = z.object({
  id: z.number(),
  mal_id: z.number(),
  user_id: z.string(),
  status: z.nativeEnum(LibraryStatus),
  favorite: z.boolean(),
  created_at: z.string(),
});

// library type
export type Library = z.infer<typeof LibrarySchema>;
export type LibraryItem = z.infer<typeof LibraryItemSchema>;