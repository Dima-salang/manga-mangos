import { sql } from '@/lib/db/client';
import { Review } from '@/types/review';

export async function createReview(
  userId: string,
  mangaId: string,
  rating: number,
  reviewText: string
) {
  try {
    await sql`
      INSERT INTO reviews (user_id, manga_id, rating, review_text)
      VALUES (${userId}, ${mangaId}, ${rating}, ${reviewText})
    `;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

export async function getUserReviews(userId: string): Promise<(Review & { mangaTitle: string; mangaImage: string })[]> {
  try {
    const result = await sql`
      SELECT 
        r.id,
        r.manga_id as "mangaId",
        r.user_id as "userId",
        r.rating,
        r.review_text as "reviewText",
        r.created_at as "createdAt",
        m.title as "mangaTitle",
        m.images->'webp'->>'large_image_url' as "mangaImage"
      FROM reviews r
      JOIN manga m ON m.mal_id = r.manga_id::integer
      WHERE r.user_id = ${userId}
      ORDER BY r.created_at DESC
    `;
    return result.rows as (Review & { mangaTitle: string; mangaImage: string })[];
  } catch (error) {
    console.error('Database connection error in getUserReviews:', error);
    // Return empty array if database is not available
    return [];
  }
}

export async function getMangaReviews(mangaId: string, currentUserId?: string): Promise<(Review & { userName: string; userImage: string; upvotes: number; downvotes: number; userVote: 'up' | 'down' | null })[]> {
  try {
    const result = await sql`
      SELECT 
        r.id,
        r.manga_id as "mangaId",
        r.user_id as "userId",
        r.rating,
        r.review_text as "reviewText",
        r.created_at as "createdAt",
        u.username as "userName",
        u.image_url as "userImage",
        COALESCE((SELECT COUNT(*) FROM review_votes WHERE review_id = r.id AND vote_type = 'up'), 0) as "upvotes",
        COALESCE((SELECT COUNT(*) FROM review_votes WHERE review_id = r.id AND vote_type = 'down'), 0) as "downvotes",
        ${currentUserId ? `(SELECT vote_type FROM review_votes WHERE review_id = r.id AND user_id = ${currentUserId})` : 'NULL'} as "userVote"
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.manga_id = ${mangaId}
      ORDER BY r.created_at DESC
    `;
    return result.rows as (Review & { userName: string; userImage: string; upvotes: number; downvotes: number; userVote: 'up' | 'down' | null })[];
  } catch (error) {
    console.error('Database connection error in getMangaReviews:', error);
    // Return empty array if database is not available
    return [];
  }
}

export async function getRecentUserReviews(userId: string, limit: number = 3): Promise<(Review & { mangaTitle: string; mangaImage: string })[]> {
  try {
    const result = await sql`
      SELECT 
        r.id,
        r.manga_id as "mangaId",
        r.user_id as "userId",
        r.rating,
        r.review_text as "reviewText",
        r.created_at as "createdAt",
        m.title as "mangaTitle",
        m.images->'webp'->>'large_image_url' as "mangaImage"
      FROM reviews r
      JOIN manga m ON m.mal_id = r.manga_id::integer
      WHERE r.user_id = ${userId}
      ORDER BY r.created_at DESC
      LIMIT ${limit}
    `;
    return result.rows as (Review & { mangaTitle: string; mangaImage: string })[];
  } catch (error) {
    console.error('Database connection error in getRecentUserReviews:', error);
    // Return empty array if database is not available
    return [];
  }
}

export async function voteReview(reviewId: string, userId: string, voteType: 'up' | 'down') {
  try {
    // Upsert the vote
    await sql`
      INSERT INTO review_votes (review_id, user_id, vote_type)
      VALUES (${reviewId}, ${userId}, ${voteType})
      ON CONFLICT (review_id, user_id) 
      DO UPDATE SET vote_type = ${voteType}, created_at = CURRENT_TIMESTAMP
    `;
  } catch (error) {
    console.error('Error voting review:', error);
    throw error;
  }
}

export async function removeVote(reviewId: string, userId: string) {
  try {
    await sql`
      DELETE FROM review_votes 
      WHERE review_id = ${reviewId} AND user_id = ${userId}
    `;
  } catch (error) {
    console.error('Error removing vote:', error);
    throw error;
  }
}
