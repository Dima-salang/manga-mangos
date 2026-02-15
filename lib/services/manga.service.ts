import { sql } from '@/lib/db/client';
import { Manga, MangaType, TopMangaFilter, JikanManga, JikanResponse } from '@/types/manga';
import { mangaFetch } from '@/lib/external-api/external-api';

export async function getAllManga(): Promise<Manga[]> {
  const { rows } = await sql`
    SELECT 
      id,
      title,
      genre,
      description,
      cover_image_url,
      official_url
    FROM manga
  `;

  return rows.map((row): Manga => ({
    id: row.id,
    title: row.title,
    genre: row.genre,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    officialUrl: row.official_url,
  }));
}

export async function getTopManga(
  type: MangaType = MangaType.MANGA,
  filter: TopMangaFilter = TopMangaFilter.BY_POPULARITY,
  page: number = 1,
  limit: number = 25
): Promise<JikanResponse<JikanManga[]>> {
  const queryParams = new URLSearchParams({
    type,
    filter,
    page: page.toString(),
    limit: limit.toString(),
  });

  return await mangaFetch<JikanResponse<JikanManga[]>>(`top/manga?${queryParams.toString()}`);
}

// manga service used
export class MangaService {
  async getTop(
    type: MangaType = MangaType.MANGA,
    filter: TopMangaFilter = TopMangaFilter.BY_POPULARITY,
    page: number = 1,
    limit: number = 25
  ): Promise<JikanResponse<JikanManga[]>> {
    return getTopManga(type, filter, page, limit);
  }
}
