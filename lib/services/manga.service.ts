import {
  MangaTypeFilter,
  TopMangaFilter,
  Manga,
  JikanResponse,
  MangaRecommendation,
  CommunityRecommendation,
  DB_MANGA,
} from "@/types/manga";
import { LibraryItem, LibraryStatus } from "@/types/library";
import { mangaFetch } from "@/lib/external-api/external-api";
import { supabaseAdmin } from "@/utils/supabase/server";
import { redis } from "@/utils/upstash-redis/redis";
import { JikanReview } from "@/types/review";

export async function getTopManga(
  type: MangaTypeFilter = MangaTypeFilter.MANGA,
  filter: TopMangaFilter = TopMangaFilter.BY_POPULARITY,
  page: number = 1,
  limit: number = 25,
): Promise<JikanResponse<Manga[]>> {
  const queryParams = new URLSearchParams({
    type,
    filter,
    page: page.toString(),
    limit: limit.toString(),
  });

  // check the cache
  let cachedTopManga: JikanResponse<Manga[]> | null = null;
  try {
    cachedTopManga = await redis.get<JikanResponse<Manga[]>>(
      `topManga:${queryParams.toString()}`,
    );
  } catch (e) {
    console.warn("Redis cache unavailable, skipping cache:", e);
  }
  if (cachedTopManga) {
    return cachedTopManga;
  }

  const response = await mangaFetch<JikanResponse<Manga[]>>(
    `top/manga?${queryParams.toString()}`,
  );

  // set the cache
  try {
    await redis.set(
      `topManga:${queryParams.toString()}`,
      JSON.stringify(response),
      {
        ex: 60 * 60 * 24,
      },
    );
  } catch (e) {
    console.warn("Redis cache write failed, continuing without cache:", e);
  }

  return response;
}

// manga service used
export class MangaService {
  async getTop(
    type: MangaTypeFilter = MangaTypeFilter.MANGA,
    filter: TopMangaFilter = TopMangaFilter.BY_POPULARITY,
    page: number = 1,
    limit: number = 25,
  ): Promise<JikanResponse<Manga[]>> {
    return getTopManga(type, filter, page, limit);
  }

  // search manga
  async getSearchResults(
    queryParams: URLSearchParams,
  ): Promise<JikanResponse<Manga[]>> {
    return await mangaFetch<JikanResponse<Manga[]>>(
      `manga?${queryParams.toString()}`,
    );
  }

  // get a specific manga
  async getManga(id: number): Promise<JikanResponse<Manga>> {
    return await mangaFetch<JikanResponse<Manga>>(`manga/${id}/full`);
  }

  // get manga recommendations
  async getMangaRecommendations(
    id: number,
  ): Promise<JikanResponse<MangaRecommendation[]>> {
    return await mangaFetch<JikanResponse<MangaRecommendation[]>>(
      `manga/${id}/recommendations`,
    );
  }

  async getCommunityRecommendations(
    page: number = 1,
  ): Promise<JikanResponse<CommunityRecommendation[]>> {
    return await mangaFetch<JikanResponse<CommunityRecommendation[]>>(
      `recommendations/manga?page=${page}`,
    );
  }

  // get reviews for a specific manga
  async getMangaReviews(id: number): Promise<JikanResponse<JikanReview[]>> {
    return await mangaFetch<JikanResponse<JikanReview[]>>(`manga/${id}/reviews`);
  }


  // get library items with manga details
  async getLibraryWithManga(
    userId: string,
  ): Promise<(LibraryItem & { manga: DB_MANGA })[]> {
    // check the cache
    let cachedLibrary: (LibraryItem & { manga: DB_MANGA })[] | null = null;
    try {
      cachedLibrary = await redis.get<
        (LibraryItem & { manga: DB_MANGA })[]
      >(`libraryWithManga:${userId}`);
    } catch (e) {
      console.warn("Redis cache unavailable, skipping cache:", e);
    }
    if (cachedLibrary) {
      return cachedLibrary;
    }

    console.log("Fetching library with manga for user:", userId);
    const { data, error } = await supabaseAdmin
      .from("library_item")
      .select(
        `
        *,
        manga:mal_id (*)
      `,
      )
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    // set the cache
    try {
      await redis.set(`libraryWithManga:${userId}`, JSON.stringify(data), {
        ex: 60 * 60 * 24,
      });
    } catch (e) {
      console.warn("Redis cache write failed, continuing without cache:", e);
    }

    return data as (LibraryItem & { manga: DB_MANGA })[];
  }

  // get a specific library item
  async getLibraryItem(
    userId: string,
    malId: number,
  ): Promise<LibraryItem | null> {
    const { data, error } = await supabaseAdmin
      .from("library_item")
      .select("*")
      .eq("user_id", userId)
      .eq("mal_id", malId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as LibraryItem | null;
  }

  // add manga to library
  async addMangaToLibrary(
    userId: string,
    manga: Manga,
    status: LibraryStatus,
    favorite: boolean,
  ): Promise<void> {
    // attempt to upsert the manga row
    const { error: mangaError } = await supabaseAdmin.from("manga").upsert(
      {
        mal_id: manga.mal_id,
        images: manga.images,
        titles: manga.titles,
      },
      {
        onConflict: "mal_id",
      },
    );

    if (mangaError) {
      throw mangaError;
    }

    // add or update the manga in the library
    const { error: libraryError } = await supabaseAdmin
      .from("library_item")
      .upsert(
        {
          user_id: userId,
          mal_id: manga.mal_id,
          status,
          favorite,
        },
        {
          onConflict: "user_id, mal_id",
        },
      );

    if (libraryError) {
      throw libraryError;
    }

    // clear the cache
    await Promise.allSettled([
      redis.del(`libraryWithManga:${userId}`).catch((e) =>
        console.warn("Redis cache invalidation failed:", e),
      ),
      redis.del(`libraryContext:${userId}`).catch((e) =>
        console.warn("Redis cache invalidation failed:", e),
      ),
    ]);
  }

  async removeMangaFromLibrary(userId: string, malId: number): Promise<void> {
    const { error: libraryError } = await supabaseAdmin
      .from("library_item")
      .delete()
      .eq("user_id", userId)
      .eq("mal_id", malId);

    if (libraryError) {
      throw libraryError;
    }

    // clear the cache
    await Promise.allSettled([
      redis.del(`libraryWithManga:${userId}`).catch((e) =>
        console.warn("Redis cache invalidation failed:", e),
      ),
      redis.del(`libraryContext:${userId}`).catch((e) =>
        console.warn("Redis cache invalidation failed:", e),
      ),
    ]);
  }

  // get a random manga
  async getRandomManga(): Promise<JikanResponse<Manga>> {
    return await mangaFetch<JikanResponse<Manga>>("random/manga", 3, {
      next: { revalidate: 0 },
    });
  }
}
