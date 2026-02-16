"use client";

import { useState, useCallback, useTransition, createContext, useContext, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Share2, 
  Loader2
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Manga } from "@/types/manga";
import { LibraryItem, LibraryStatus } from "@/types/library";
import { addMangaToLibraryAction } from "@/app/library/library";

interface MangaLibraryContextType {
  isFavorite: boolean;
  status: LibraryStatus | "none";
  isPending: boolean;
  toggleFavorite: () => void;
  updateStatus: (newStatus: LibraryStatus) => void;
}

const MangaLibraryContext = createContext<MangaLibraryContextType | null>(null);

export function MangaLibraryProvider({ 
  manga, 
  initialLibraryItem, 
  children 
}: { 
  manga: Manga; 
  initialLibraryItem: LibraryItem | null; 
  children: React.ReactNode 
}) {
  const [isFavorite, setIsFavorite] = useState(initialLibraryItem?.favorite || false);
  const [status, setStatus] = useState<LibraryStatus | "none">(initialLibraryItem?.status || "none");
  const [isPending, startTransition] = useTransition();

  const toggleFavorite = useCallback(() => {
    const newFavorite = !isFavorite;
    // Use the current live status, or default to PLAN_TO_READ if not in library yet
    const currentStatus = status === "none" ? LibraryStatus.PLAN_TO_READ : status;
    
    startTransition(async () => {
      const result = await addMangaToLibraryAction(
        manga.mal_id, 
        currentStatus, 
        newFavorite
      );

      if (result.success) {
        setIsFavorite(newFavorite);
        // If it was "none", it's now in library with currentStatus
        if (status === "none") {
          setStatus(currentStatus);
        }
        toast.success(newFavorite ? "Added to favorites" : "Removed from favorites", {
          description: newFavorite ? "Manga added to your favorites." : "Manga removed from your favorites.",
          icon: newFavorite ? <Heart className="w-4 h-4 fill-mango text-mango" /> : undefined
        });
      } else {
        toast.error("Failed to update favorite status", {
          description: result.error
        });
      }
    });
  }, [isFavorite, status, manga.mal_id]);

  const updateStatus = useCallback((newStatus: LibraryStatus) => {
    startTransition(async () => {
      const result = await addMangaToLibraryAction(
        manga.mal_id, 
        newStatus, 
        isFavorite
      );

      if (result.success) {
        setStatus(newStatus);
        toast.success(`Status updated to: ${newStatus.replaceAll('_', ' ')}`, {
          description: "Your library has been updated.",
          className: "bg-mango/10 border-mango/20 text-foreground font-bold"
        });
      } else {
        toast.error("Failed to update status", {
          description: result.error
        });
      }
    });
  }, [isFavorite, manga.mal_id]);

  const contextValue = useMemo(() => ({ 
    isFavorite, 
    status, 
    isPending, 
    toggleFavorite, 
    updateStatus 
  }), [isFavorite, status, isPending, toggleFavorite, updateStatus]);

  return (
    <MangaLibraryContext.Provider value={contextValue}>
      {children}
    </MangaLibraryContext.Provider>
  );
}

function useMangaLibrary() {
  const context = useContext(MangaLibraryContext);
  if (!context) {
    throw new Error("useMangaLibrary must be used within a MangaLibraryProvider");
  }
  return context;
}

export function DetailActions() {
  const { isFavorite, isPending, toggleFavorite } = useMangaLibrary();

  const handleShare = useCallback(() => {
    globalThis.navigator.clipboard.writeText(globalThis.location.href)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          description: "You can now share this manga with others.",
        });
      })
      .catch(() => {
        toast.error("Failed to copy link", {
          description: "Please copy the URL manually.",
        });
      });
  }, []);

  return (
    <div className="flex items-center gap-4" suppressHydrationWarning>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/5 border border-white/10 hover:bg-mango/10 hover:text-mango hover:border-mango/20 transition-all duration-300"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" suppressHydrationWarning />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-background border-mango/20 font-bold">Share this manga</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isPending}
            className={`rounded-full border transition-all duration-300 ${
              isFavorite 
                ? 'bg-mango/20 border-mango text-mango shadow-[0_0_15px_rgba(255,159,67,0.2)]' 
                : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-mango/10 hover:text-mango hover:border-mango/20'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={toggleFavorite}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : 'group-hover:scale-110'}`} suppressHydrationWarning />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-background border-mango/20 font-bold">
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function ReadingStatusSelect() {
  const { status, isPending, updateStatus } = useMangaLibrary();

  return (
    <div className="space-y-3">
      <Select 
        value={status === "none" ? "" : status} 
        onValueChange={(val) => updateStatus(val as LibraryStatus)}
        disabled={isPending}
      >
        <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 rounded-xl font-bold focus:ring-mango/50 relative overflow-hidden group" suppressHydrationWarning>
          <div className="flex items-center gap-2">
            {isPending ? <Loader2 className="w-3 h-3 animate-spin text-mango" /> : null}
            <SelectValue placeholder="Add to List" suppressHydrationWarning />
          </div>
          <div className="absolute inset-0 bg-mango/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </SelectTrigger>
        <SelectContent className="bg-card border-white/10 rounded-xl backdrop-blur-xl">
          <SelectItem value={LibraryStatus.READING} className="font-bold focus:bg-mango/10 transition-colors">Reading</SelectItem>
          <SelectItem value={LibraryStatus.COMPLETED} className="font-bold focus:bg-mango/10 transition-colors">Completed</SelectItem>
          <SelectItem value={LibraryStatus.PLAN_TO_READ} className="font-bold focus:bg-mango/10 transition-colors">Plan to Read</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}