import { sql } from '@/lib/db/client';
import { Manga } from '@/types/manga';

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
