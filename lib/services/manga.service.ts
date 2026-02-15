import { MangaTypeFilter, TopMangaFilter, Manga, JikanResponse } from '@/types/manga';
import { mangaFetch } from '@/lib/external-api/external-api';


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
}
