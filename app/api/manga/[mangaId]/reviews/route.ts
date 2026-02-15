import { NextResponse } from 'next/server';
import { createReview } from '@/lib/services/review.service';
import { z } from 'zod';

const reviewSchema = z.object({
  userId: z.string().uuid().or(z.string().min(1)), // Handle both UUID and string IDs
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(1).max(1000),
});

export async function POST(req: Request, { params }: { params: Promise<{ mangaId: string }> }) {
  try {
    const { mangaId } = await params;
    const body = await req.json();
    
    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid review data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { userId, rating, reviewText } = result.data;

    await createReview(
      userId,
      mangaId,
      rating,
      reviewText
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create review" },
      { status: 500 }
    );
  }
}
