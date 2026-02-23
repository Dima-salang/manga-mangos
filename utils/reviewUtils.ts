import { Star } from 'lucide-react';
import { MangaTitle } from '@/types/review';

export const renderStars = (
  rating: number, 
  interactive: boolean = false, 
  setRating?: (rating: number) => void
) => {
  return Array.from({ length: 10 }, (_, i) => {
    const starProps: React.ComponentProps<typeof Star> = {
      key: i,
      className: `w-6 h-6 transition-colors ${
        i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
      }${
        interactive ? ' cursor-pointer hover:text-yellow-200' : ''
      }`,
    };
    
    if (interactive && setRating) {
      starProps.onClick = () => setRating(i + 1);
    }
    
    return <Star {...starProps} />;
  });
};

export const getMangaTitle = (
  titles: MangaTitle | string | undefined
): string => {
  if (!titles) return 'Unknown Manga';
  if (typeof titles === 'string') return titles;
  if (titles.en) return titles.en;
  if (titles.ja) return titles.ja;
  
  // Safer fallback - return first available string value
  const values = Object.values(titles).filter(v => typeof v === 'string');
  return values.length > 0 ? values[0] : 'Unknown Manga';
};
