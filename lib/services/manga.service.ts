import { MangaTypeFilter, TopMangaFilter, Manga, JikanResponse, DB_MANGA } from '@/types/manga';
import { LibraryItem } from '@/types/library';
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

}
