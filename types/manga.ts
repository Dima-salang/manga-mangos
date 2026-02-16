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
  OEL = "OEL"
}

export enum MangaStatus { 
  PUBLISHING = "Publishing",
  FINISHED = "Finished",
  ON_HIATUS = "On Hiatus",
  DISCONTINUED = "Discontinued", 
  NOT_YET_PUBLISHED = "Not yet published"
}

// Manga Type Enum for filtering
export enum MangaTypeFilter {
  MANGA = "manga",
  NOVEL = "novel",
  LIGHTNOVEL = "lightnovel",
  MANHWA = "manhwa",
  MANHUA = "manhua",
  ONESHOT = "oneshot",
  DOUJIN = "doujin"
}

export enum TopMangaFilter {
  PUBLISHING = "publishing",
  UPCOMING = "upcoming",
  BY_POPULARITY = "bypopularity",
  FAVORITE = "favorite"
}
