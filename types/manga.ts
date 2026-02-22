import { z } from "zod";

// DB manga
export const DB_MangaSchema = z.object({
  mal_id: z.number(),
  created_at: z.coerce.date(),
  images: z.any(),
  titles: z.any(),
});

export type DB_MANGA = z.infer<typeof DB_MangaSchema>;

// Jikan-specific Manga interface for external API results
export interface Manga {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  chapters: number | null;
  volumes: number | null;
  status: string;
  publishing: boolean;
  published: {
    from: string;
    to: string | null;
    prop: {
      from: { day: number | null; month: number | null; year: number | null };
      to: { day: number | null; month: number | null; year: number | null };
      string: string;
    };
  };
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  authors: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  serializations: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
}

export interface MangaRecommendation {
  entry: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    title: string;
  };
  url?: string;
  votes?: number;
}

export const CommunityRecommendationSchema = z.object({
  mal_id: z.string(),
  entry: z.array(
    z.object({
      mal_id: z.number(),
      url: z.string(),
      images: z.object({
        jpg: z.object({
          image_url: z.string(),
          small_image_url: z.string(),
          large_image_url: z.string(),
        }),
        webp: z.object({
          image_url: z.string(),
          small_image_url: z.string(),
          large_image_url: z.string(),
        }),
      }),
      title: z.string(),
    }),
  ),
  content: z.string(),
  user: z.object({
    url: z.string(),
    username: z.string(),
  }),
});

export type CommunityRecommendation = z.infer<
  typeof CommunityRecommendationSchema
>;

export const CommunityRecommendationsResponseSchema = z.object({
  data: z.array(CommunityRecommendationSchema),
  pagination: z
    .object({
      last_visible_page: z.number().optional(),
      has_next_page: z.boolean().optional(),
    })
    .optional(),
});

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// Manga Type Enum for getting the specific manga
export enum MangaType {
  MANGA = "Manga",
  NOVEL = "Novel",
  LIGHTNOVEL = "Light Novel",
  MANHWA = "Manhwa",
  MANHUA = "Manhua",
  ONESHOT = "One-shot",
  DOUJIN = "Doujinshi",
  OEL = "OEL",
}

export enum MangaStatus {
  PUBLISHING = "Publishing",
  FINISHED = "Finished",
  ON_HIATUS = "On Hiatus",
  DISCONTINUED = "Discontinued",
  NOT_YET_PUBLISHED = "Not yet published",
}

// Manga Type Enum for filtering
export enum MangaTypeFilter {
  MANGA = "manga",
  NOVEL = "novel",
  LIGHTNOVEL = "lightnovel",
  MANHWA = "manhwa",
  MANHUA = "manhua",
  ONESHOT = "oneshot",
  DOUJIN = "doujin",
}

export enum TopMangaFilter {
  PUBLISHING = "publishing",
  UPCOMING = "upcoming",
  BY_POPULARITY = "bypopularity",
  FAVORITE = "favorite",
}

// genre map
// Map genre names to Jikan genre IDs
export const GENRE_MAP: Record<string, number> = {
  Action: 1,
  Adventure: 2,
  Cars: 3,
  Comedy: 4,
  Dementia: 5,
  Demons: 6,
  Drama: 8,
  Ecchi: 9,
  Fantasy: 10,
  Game: 11,
  Harem: 35,
  Historical: 13,
  Horror: 14,
  Isekai: 62,
  Josei: 43,
  Kids: 15,
  Magic: 16,
  "Martial Arts": 17,
  Mecha: 18,
  Military: 38,
  Music: 19,
  Mystery: 7,
  Parody: 20,
  Police: 39,
  Psychological: 40,
  Romance: 22,
  Samurai: 21,
  School: 23,
  "Sci-Fi": 24,
  Seinen: 42,
  Shoujo: 25,
  "Shoujo Ai": 26,
  Shounen: 27,
  "Shounen Ai": 28,
  "Slice of Life": 36,
  Space: 29,
  Sports: 30,
  "Super Power": 31,
  Supernatural: 37,
  Thriller: 41,
  Vampire: 32,
};
