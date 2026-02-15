export interface Manga {
  id: number;
  title: string;
  genres: string[];
  views: number;
  rating: number;
  description?: string;
  image?: string;
}

export const MANGA_DATA: Manga[] = [
  {
    id: 1,
    title: "Attack on Titan",
    genres: ["Action", "Adventure", "Fantasy"],
    views: 50000,
    rating: 4.8,
    description: "Humanity fights back against titans"
  },
  // Template file for manga data, you can add more manga objects here
];



// manga service