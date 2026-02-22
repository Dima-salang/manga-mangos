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
  "Adult Cast": 50,
  Anthropomorphic: 51,
  "Avant Garde": 5,
  "Award Winning": 46,
  "Boys Love": 28,
  CGDCT: 52,
  Childcare: 53,
  Comedy: 4,
  "Combat Sports": 54,
  Crossdressing: 44,
  Delinquents: 55,
  Detective: 39,
  Drama: 8,
  Ecchi: 9,
  Educational: 56,
  Erotica: 49,
  Fantasy: 10,
  "Gag Humor": 57,
  "Girls Love": 26,
  Gore: 58,
  Gourmet: 47,
  Harem: 35,
  Hentai: 12,
  "High Stakes Game": 59,
  Historical: 13,
  Horror: 14,
  "Idols (Female)": 60,
  "Idols (Male)": 61,
  Isekai: 62,
  Iyashikei: 63,
  Josei: 42,
  Kids: 15,
  "Love Polygon": 64,
  "Love Status Quo": 75,
  "Magical Sex Shift": 65,
  "Mahou Shoujo": 66,
  "Martial Arts": 17,
  Mecha: 18,
  Medical: 67,
  Memoir: 68,
  Military: 38,
  Music: 19,
  Mystery: 7,
  Mythology: 6,
  "Organized Crime": 69,
  "Otaku Culture": 70,
  Parody: 20,
  "Performing Arts": 71,
  Pets: 72,
  Psychological: 40,
  Racing: 3,
  Reincarnation: 73,
  "Reverse Harem": 74,
  Romance: 22,
  Samurai: 21,
  School: 23,
  "Sci-Fi": 24,
  Seinen: 41,
  Shoujo: 25,
  Shounen: 27,
  "Slice of Life": 36,
  Space: 29,
  Sports: 30,
  "Strategy Game": 11,
  "Super Power": 31,
  Supernatural: 37,
  Survival: 77,
  Suspense: 45,
  "Team Sports": 78,
  "Time Travel": 79,
  "Urban Fantasy": 83,
  Vampire: 32,
  "Video Game": 80,
  Villainess: 81,
  "Visual Arts": 82,
  Workplace: 48,
};
