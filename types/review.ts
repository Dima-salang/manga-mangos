import { supabaseAdmin } from './server';
import { Review, ReviewWithManga, CreateReviewData } from '@/types/review';

export async function createReview(data: CreateReviewData) {
  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create review: ${error.message}`);
  }

  return review;
}

export async function getUserReviews(userId: string): Promise<ReviewWithManga[]> {
  const { data: reviews, error } = await supabaseAdmin
    .from('reviews')
    .select(`
      *,
      manga (
        mal_id,
        titles
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch user reviews: ${error.message}`);
  }

  return reviews;
}

export async function getReviewById(id: number) {
  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch review: ${error.message}`);
  }

  return review;
}

export async function updateReview(id: number, data: Partial<CreateReviewData>, userId: string) {
  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .update(data)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update review: ${error.message}`);
  }

  return review;
}

export async function deleteReview(id: number, userId: string) {
  const { error } = await supabaseAdmin
    .from('reviews')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete review: ${error.message}`);
  }

  return true;
}

export async function getReviewByUserAndManga(userId: string, malId: number) {
  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('mal_id', malId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch review: ${error.message}`);
  }

  return review;
