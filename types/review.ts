export interface Review {
  id: string;
  mangaId: string;
  userId: string;
  rating: number;
  reviewText: string;
  createdAt: Date;
}
