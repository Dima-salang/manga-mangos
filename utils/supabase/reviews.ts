import supabase from './server';

export interface Review {
  id: number;
  created_at: string;
  user_id: string;
  mal_id: number;
  rating: number;
  review_text: string;
}

export interface CreateReviewData {
  user_id: string;
  mal_id: number;
  rating: number;
  review_text: string;
}

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

export async function updateReview(id: number, data: Partial<CreateReviewData>) {
  const { data: review, error } = await supabase
    .from('reviews')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update review: ${error.message}`);
  }

  return review;
}

export async function deleteReview(id: number) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

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
