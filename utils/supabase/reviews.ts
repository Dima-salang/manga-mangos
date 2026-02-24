import { supabaseAdmin } from './server';
import { Review, CreateReviewData } from '@/types/review';

export async function createReview(data: CreateReviewData) {
  // Validate rating is an integer between 1 and 10
  if (typeof data.rating !== 'number' || !Number.isInteger(data.rating) || data.rating < 1 || data.rating > 10) {
    throw new Error('Rating must be an integer between 1 and 10');
  }

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

export async function getUserReviews(userId: string) {
  const { data: reviews, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
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

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch review: ${error.message}`);
  }

  return review;
}

export async function updateReview(id: number, data: Partial<CreateReviewData>, userId?: string) {
  // Validate rating if present
  if (data.rating !== undefined) {
    if (typeof data.rating !== 'number' || !Number.isInteger(data.rating) || data.rating < 1 || data.rating > 10) {
      throw new Error('Rating must be an integer between 1 and 10');
    }
  }

  let query = supabaseAdmin.from('reviews').update(data).eq('id', id);
  
  // Only apply user_id filter if userId is provided
  if (userId !== undefined && userId !== null) {
    query = query.eq('user_id', userId);
  }
  
  const { data: review, error } = await query.select().single();

  if (error) {
    throw new Error(`Failed to update review: ${error.message}`);
  }

  return review;
}

export async function deleteReview(id: number, userId?: string) {
  let query = supabaseAdmin.from('reviews').delete().eq('id', id);
  
  // Only apply user_id filter if userId is provided
  if (userId !== undefined && userId !== null) {
    query = query.eq('user_id', userId);
  }
  
  const { error } = await query;
  
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
}
