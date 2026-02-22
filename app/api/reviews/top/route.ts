import { ReviewService } from "@/lib/services/review.service";
import { NextResponse } from "next/server";

export async function GET() {
  const reviewService = new ReviewService();
  try {
    const data = await reviewService.getTopReviews();
    console.log(
      "Top reviews API response snippet:",
      JSON.stringify(data).slice(0, 10),
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching top reviews:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch top reviews" },
      { status: 500 },
    );
  }
}
