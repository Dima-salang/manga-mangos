import { NextResponse } from 'next/server';
import { createReview } from '@/lib/services/review.service';

export async function POST(req: Request, { params }: any) {
  const body = await req.json();
  await createReview(
    body.userId,
    params.mangaId,
    body.rating,
    body.reviewText
  );

  return NextResponse.json({ success: true });
}
