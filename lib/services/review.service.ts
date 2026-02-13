import { sql } from '@/lib/db/client';

export async function createReview(
  userId: string,
  mangaId: string,
  rating: number,
  reviewText: string
) {
  await sql`
    INSERT INTO reviews (user_id, manga_id, rating, review_text)
    VALUES (${userId}, ${mangaId}, ${rating}, ${reviewText})
  `;
}
