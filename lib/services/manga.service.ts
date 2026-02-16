import { MangaTypeFilter, TopMangaFilter, Manga, JikanResponse, MangaRecommendation, DB_MANGA } from '@/types/manga';
import { LibraryItem, LibraryStatus } from '@/types/library';
import { mangaFetch } from '@/lib/external-api/external-api';
import { supabaseAdmin } from '@/utils/supabase/server';


export async function getTopManga(
  type: MangaTypeFilter = MangaTypeFilter.MANGA,
  filter: TopMangaFilter = TopMangaFilter.BY_POPULARITY,
  page: number = 1,
  limit: number = 25
): Promise<JikanResponse<Manga[]>> {
  const queryParams = new URLSearchParams({
    type,
    filter,
    page: page.toString(),
    limit: limit.toString(),
  });

  return await mangaFetch<JikanResponse<Manga[]>>(`top/manga?${queryParams.toString()}`);
}

// manga service used
export class MangaService {
  async getTop(
    type: MangaTypeFilter = MangaTypeFilter.MANGA,
    filter: TopMangaFilter = TopMangaFilter.BY_POPULARITY,
    page: number = 1,
    limit: number = 25
  ): Promise<JikanResponse<Manga[]>> {
    return getTopManga(type, filter, page, limit);
  }

  // get a specific manga
  async getManga(id: number): Promise<JikanResponse<Manga>> {
    return await mangaFetch<JikanResponse<Manga>>(`manga/${id}/full`);
  }

  // get manga recommendations
  async getMangaRecommendations(id: number): Promise<JikanResponse<MangaRecommendation[]>> {
    return await mangaFetch<JikanResponse<MangaRecommendation[]>>(`manga/${id}/recommendations`);
  }

  // get library items with manga details
  async getLibraryWithManga(userId: string): Promise<(LibraryItem & { manga: DB_MANGA })[]> {
    const { data, error } = await supabaseAdmin
      .from('library_item')
      .select(`
        *,
        manga:mal_id (*)
      `)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data as (LibraryItem & { manga: DB_MANGA })[];
  }

  // get a specific library item
  async getLibraryItem(userId: string, malId: number): Promise<LibraryItem | null> {
    const { data, error } = await supabaseAdmin
      .from('library_item')
      .select('*')
      .eq('user_id', userId)
      .eq('mal_id', malId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as LibraryItem | null;
  }

  // add manga to library
  async addMangaToLibrary(userId: string, manga: Manga, status: LibraryStatus, favorite: boolean): Promise<void> {

    // check if manga exists in the db
    const mangaExists = await this.checkMangaExists(manga.mal_id);

    let addedManga: DB_MANGA;

    if (!mangaExists) {
      // if it does not, we add the manga
      addedManga = await this.addManga(manga);
    } else {
      addedManga = {
        mal_id: manga.mal_id,
        created_at: new Date(),
        images: manga.images,
        titles: manga.titles,
      }
    }

    // add or update the manga in the library
    const { error } = await supabaseAdmin
      .from('library_item')
      .upsert({
          user_id: userId,
          mal_id: addedManga.mal_id,
          status,
          favorite,
      }, {
        onConflict: 'user_id, mal_id'
      });

    if (error) {
      throw error;
    }
  }

  async addManga(manga: Manga): Promise<DB_MANGA> {
    // only get the mal_id, images, and titles
    const db_manga: DB_MANGA = {
      mal_id: manga.mal_id,
      created_at: new Date(),
      images: manga.images,
      titles: manga.titles,
    }

    const { error } = await supabaseAdmin
      .from('manga')
      .insert(db_manga);

    if (error) {
      throw error;
    }

    return db_manga;
  }

  async checkMangaExists(malId: number): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from("manga")
      .select("mal_id")
      .eq("mal_id", malId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return !!data;
  }
}
