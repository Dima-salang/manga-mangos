import supabase from './server';
import { Review, CreateReviewData } from '@/types/review';

export async function createReview(data: CreateReviewData) {
  const { data: review, error } = await supabase
    .from('reviews')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create review: ${error.message}`);
  }

  return review;
}

export async function getUserReviews(userId: string) {
  const { data: reviews, error } = await supabase
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
  const { data: review, error } = await supabase
    .from('reviews')
    .select(`
      *,
      manga (
        mal_id,
        titles
      )
    `)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch review: ${error.message}`);
  }

  return review;
}

export async function updateReview(id: number, data: Partial<CreateReviewData>, userId?: string) {
  const { data: review, error } = await supabase
    .from('reviews')
    .update(data)
    .eq('id', id)
    .eq('user_id', userId) // Row-level security filter
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update review: ${error.message}`);
  }

  return review;
}

export async function deleteReview(id: number, userId?: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)
    .eq('user_id', userId) // Row-level security filter
    .single();

  if (error) {
    throw new Error(`Failed to delete review: ${error.message}`);
  }

  return true;
}

export async function getReviewByUserAndManga(userId: string, malId: number) {
  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('mal_id', malId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch review: ${error.message}`);
  }

  return review;
}
