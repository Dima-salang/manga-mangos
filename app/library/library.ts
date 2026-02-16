"use server";

import { auth } from "@clerk/nextjs/server";
import { MangaService } from "@/lib/services/manga.service";
import { Manga } from "@/types/manga";
import { LibraryStatus } from "@/types/library";
import { revalidatePath } from "next/cache";

export async function addMangaToLibraryAction(manga: Manga, status: LibraryStatus, favorite: boolean) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be logged in to add manga to your library");
  }

  const mangaService = new MangaService();
  
  try {
    await mangaService.addMangaToLibrary(userId, manga, status, favorite);
    revalidatePath(`/manga/${manga.mal_id}/detail`);
    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error("Error adding manga to library:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
