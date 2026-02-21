import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUserReviews } from "@/lib/services/review.service";
import { Star, MessageSquare, Calendar, ExternalLink } from "lucide-react";
import { PageDebug } from "@/components/page-debug";

export default async function ReviewPage() {
  // Mock data for testing
  const reviews = await getUserReviews("test-user");

  return (
    <div className="min-h-screen bg-background relative selection:bg-mango/30">
      <PageDebug />
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 manga-grid opacity-5 pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="relative mb-16 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-mango font-black uppercase tracking-[0.4em] text-[10px]">
                <div className="w-12 h-[2px] bg-mango" />
                <span>Your Reviews</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                My <span className="text-mango">Reviews</span>
              </h1>
              <p className="text-muted-foreground/60 font-medium tracking-wide">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} shared
              </p>
            </div>

            <Button 
              asChild
              className="bg-mango text-black hover:bg-mango/90 font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl"
            >
              <Link href="/browse">
                Browse to Review
              </Link>
            </Button>
          </div>

          {/* Decorative background text */}
          <div className="absolute -bottom-10 -right-20 text-[15rem] font-black italic uppercase text-white/[0.02] select-none pointer-events-none">
            REVIEWS
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card 
                key={review.id} 
                className="border border-white/5 bg-white/[0.02] backdrop-blur-3xl overflow-hidden hover:border-mango/20 transition-all duration-500 rounded-[2rem] group"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Manga Cover */}
                    <Link 
                      href={`/manga/${review.mangaId}/detail`}
                      className="relative w-full md:w-48 aspect-[3/4] md:aspect-auto md:h-full shrink-0 overflow-hidden"
                    >
                      {review.mangaImage ? (
                        <Image
                          src={review.mangaImage}
                          alt={review.mangaTitle}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-4xl">
                          🥭
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20 md:bg-gradient-to-l" />
                    </Link>

                    {/* Review Content */}
                    <div className="flex-1 p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div>
                          <Link 
                            href={`/manga/${review.mangaId}/detail`}
                            className="text-xl font-black uppercase tracking-tight hover:text-mango transition-colors line-clamp-1"
                          >
                            {review.mangaTitle}
                          </Link>
                          <div className="flex items-center gap-4 mt-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-mango/10 px-4 py-2 rounded-xl shrink-0">
                          <Star className="w-4 h-4 text-mango fill-mango" />
                          <span className="font-black text-lg text-mango">{review.rating}</span>
                          <span className="text-[10px] font-bold text-muted-foreground/60">/10</span>
                        </div>
                      </div>

                      <Separator className="bg-white/5 mb-6" />

                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-mango/60 mt-1 shrink-0" />
                        <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                          {review.reviewText}
                        </p>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Link 
                          href={`/manga/${review.mangaId}/detail`}
                          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-mango transition-colors"
                        >
                          View Manga
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
            <div className="text-6xl mb-6 grayscale">🥭</div>
            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground mb-2">
              No Reviews Yet
            </h3>
            <p className="text-sm text-muted-foreground/60 max-w-md mx-auto mb-8">
              Start sharing your thoughts on manga you&apos;ve read. Your reviews help others discover great reads.
            </p>
            <Button 
              asChild
              className="bg-mango text-black hover:bg-mango/90 font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl"
            >
              <Link href="/browse">
                Browse Manga
              </Link>
            </Button>
          </div>
        )}
      </main>

      {/* Decorative Footer */}
      <footer className="py-24 border-t border-white/5 opacity-5 select-none pointer-events-none overflow-hidden">
        <div className="text-[12rem] font-black italic uppercase whitespace-nowrap">
          REVIEWS FEEDBACK COMMENTS REVIEWS FEEDBACK
        </div>
      </footer>
    </div>
  );
}
