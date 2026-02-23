import { NextRequest, NextResponse } from 'next/server';
import { getReviewById, updateReview, deleteReview } from '@/utils/supabase/reviews';
import { auth } from '@clerk/nextjs/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    // Check ownership
    const existingReview = await getReviewById(id);
    if (!existingReview || existingReview.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { rating, review_text } = body;

    if (rating !== undefined && (rating < 1 || rating > 10)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 10' },
        { status: 400 }
      );
    }

    const review = await updateReview(id, { rating, review_text }, userId);
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid review ID' }, { status: 400 });
    }

    // Check ownership
    const existingReview = await getReviewById(id);
    if (!existingReview || existingReview.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteReview(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
