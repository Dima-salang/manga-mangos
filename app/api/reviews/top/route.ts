import { ReviewService } from "@/lib/services/review.service";
import { NextResponse } from "next/server";
import { topReviewSchema } from "@/types/review";

export async function GET() {
  const reviewService = new ReviewService();
  try {
    const data = await reviewService.getTopReviews();

    // validate the response
    const parsed = topReviewSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Invalid top reviews data:", parsed.error);
      return NextResponse.json(
        { error: "Invalid top reviews data" },
        { status: 500 },
      );
    }
    return NextResponse.json(parsed.data);
  } catch (error: any) {
    console.error("Error fetching top reviews:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch top reviews" },
      { status: 500 },
    );
  }
}
