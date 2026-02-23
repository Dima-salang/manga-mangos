import { z } from "zod";

export interface Review {
  id: number;
  created_at: string;
  user_id: string;
  mal_id: number;
  rating: number;
  review_text: string;
  manga?: {
    mal_id: number;
    titles: MangaTitle;
  };
}

export interface ReviewWithManga extends Review {
  manga: {
    mal_id: number;
    titles: MangaTitle;
  };
}

export interface MangaTitle {
  en?: string;
  ja?: string;
}

export interface CreateReviewData {
  user_id: string;
  mal_id: number;
  rating: number;
  review_text: string;
}

export const reviewSchema = z.object({
  id: z.string(),
  mangaId: z.string(),
  userId: z.string(),
  rating: z.number(),
  reviewText: z.string(),
  createdAt: z.date(),
});

// Jikan-specific schema based on user request
const JikanUserImageSchema = z.object({
  image_url: z.string(),
});

const JikanAnimeImageSchema = z.object({
  image_url: z.string(),
  small_image_url: z.string(),
  large_image_url: z.string(),
});

export const JikanReviewSchema = z.object({
  user: z.object({
    username: z.string(),
    url: z.string(),
    images: z
      .object({
        jpg: JikanUserImageSchema,
        webp: JikanUserImageSchema,
      })
      .optional(),
  }),
  anime: z
    .object({
      mal_id: z.number(),
      url: z.string(),
      images: z
        .object({
          jpg: JikanAnimeImageSchema,
          webp: JikanAnimeImageSchema,
        })
        .optional(),
      title: z.string(),
    })
    .optional(),
  manga: z
    .object({
      mal_id: z.number(),
      url: z.string(),
      images: z
        .object({
          jpg: JikanAnimeImageSchema,
          webp: JikanAnimeImageSchema,
        })
        .optional(),
      title: z.string(),
    })
    .optional(),
  entry: z
    .object({
      mal_id: z.number(),
      url: z.string(),
      images: z
        .object({
          jpg: JikanAnimeImageSchema,
          webp: JikanAnimeImageSchema,
        })
        .optional(),
      title: z.string(),
    })
    .optional(),
  mal_id: z.number(),
  url: z.string(),
  type: z.string(),
  reactions: z.object({
    overall: z.number(),
    nice: z.number(),
    love_it: z.number(),
    funny: z.number(),
    confusing: z.number(),
    informative: z.number(),
    well_written: z.number(),
    creative: z.number(),
  }),
  date: z.string(),
  review: z.string(),
  score: z.number(),
  tags: z.array(z.string()),
  is_spoiler: z.boolean(),
  is_preliminary: z.boolean(),
  episodes_watched: z.number().optional(),
});

export type JikanReview = z.infer<typeof JikanReviewSchema>;

export const topReviewSchema = z.object({
  data: z.array(JikanReviewSchema),
  pagination: z.object({
    last_visible_page: z.number().optional(),
    has_next_page: z.boolean().optional(),
  }),
});

export type TopReviewResponse = z.infer<typeof topReviewSchema>;
