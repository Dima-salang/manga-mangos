import { mangaFetch } from "@/lib/external-api/external-api";
import { TopReviewResponse } from "@/types/review";

export class ReviewService {
  async getTopReviews() {
    return await mangaFetch<TopReviewResponse>("top/reviews?type=manga");
  }
}
