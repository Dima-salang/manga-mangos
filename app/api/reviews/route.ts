import { NextRequest, NextResponse } from 'next/server';
import { getUserReviews, createReview } from '@/utils/supabase/reviews';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    return NextResponse.json({ reviews: [] });
  }

  try {
    const reviews = await getUserReviews(userId);
    return NextResponse.json({ reviews });
  } catch (err: unknown) {
    console.error('REVIEWS FETCH FAILED:', err);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { mal_id, rating, review_text } = body;

    if (!mal_id || !rating || !review_text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const review = await createReview({
      user_id: userId,
      mal_id,
      rating,
      review_text,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err: unknown) {
    console.error('CREATE REVIEW FAILED:', err);
    const message = err instanceof Error ? err.message : 'Failed to create review';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
