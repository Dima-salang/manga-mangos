import { z } from "zod";
import { rate } from "@/utils/upstash-redis/redis";

const BASE_URL = "https://api.jikan.moe/v4/";

const jikanErrorSchema = z.object({
  status: z.number(),
  type: z.string().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  report_url: z.string().optional(),
});

export async function mangaFetch<T>(
  path: string,
  retries: number = 3,
): Promise<T> {
  const { success } = await rate.limit("jikan");

  // if the api is rate limited, retry after a second
  if (!success) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mangaFetch(path, retries - 1);
    }
    throw new Error("API is rate limited. Please try again after a while.");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    if (res.status === 429 && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mangaFetch(path, retries - 1);
    }
    let errorMessage = res.statusText;
    try {
      const data = await res.json();
      const result = jikanErrorSchema.safeParse(data);
      if (result.success) {
        errorMessage = result.data.message || result.data.error || errorMessage;
      }
    } catch (e) {
      console.debug("Non-JSON error response from Jikan API:", e);
    }
    throw new Error(`Jikan API Error (${res.status}): ${errorMessage}`);
  }

  const data = await res.json();
  return data as T;
}

// interface for the json error response from jikan api
export interface JikanJsonError {
  status: number;
  type: string;
  message: string;
  error: string;
  report_url: string;
}
