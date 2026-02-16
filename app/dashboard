"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [stats] = useState({
    reading: 3,
    completed: 42,
    onHold: 2,
    dropped: 1,
    planToRead: 7
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalManga = stats.reading + stats.completed + stats.onHold + stats.dropped + stats.planToRead;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setProfileImage(imageUrl);
      setImageUrl("");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 manga-grid opacity-10 pointer-events-none" />
      
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-mango/20 border-2 border-mango flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:border-mango/60"
                   onClick={() => setShowImageOptions(!showImageOptions)}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-mango">U</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                   onClick={() => setShowImageOptions(!showImageOptions)}>
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tight mb-2">
                <span className="text-mango">/</span> My Profile
              </h1>
              <p className="text-muted-foreground">
                Track your manga journey and share your thoughts
              </p>
            </div>
          </div>

          {/* Image Upload Options */}
          {showImageOptions && (
            <Card className="border border-white/5 bg-card/20 backdrop-blur-md mb-6">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Change Profile Picture</h3>
                <div className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Upload from device:</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button 
                      onClick={triggerFileInput}
                      variant="outline" 
                      className="w-full border-white/10 hover:border-mango/40"
                    >
                      Choose File
                    </Button>
                  </div>

                  {/* URL Input */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Or use image URL:</p>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 bg-background/50 border-white/10"
                      />
                      <Button 
                        onClick={handleUrlSubmit}
                        className="bg-mango text-white hover:bg-mango/90"
                      >
                        Set
                      </Button>
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button 
                    onClick={() => setShowImageOptions(false)}
                    variant="ghost" 
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Manga Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Manga Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="border border-white/5 bg-card/20 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">{stats.reading}</div>
                <div className="text-sm text-muted-foreground">Reading</div>
              </CardContent>
            </Card>
            <Card className="border border-white/5 bg-card/20 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="border border-white/5 bg-card/20 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.onHold}</div>
                <div className="text-sm text-muted-foreground">On-Hold</div>
              </CardContent>
            </Card>
            <Card className="border border-white/5 bg-card/20 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">{stats.dropped}</div>
                <div className="text-sm text-muted-foreground">Dropped</div>
              </CardContent>
            </Card>
            <Card className="border border-white/5 bg-card/20 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{stats.planToRead}</div>
                <div className="text-sm text-muted-foreground">Plan to Read</div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-medium">Total: <span className="text-mango">{totalManga}</span> manga</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reviews */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              <Card className="border border-white/5 bg-card/20 backdrop-blur-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src="https://cdn.myanimelist.net/images/manga/3/23186l.jpg" 
                      alt="Attack on Titan"
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Attack on Titan</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(9)].map((_, i) => (
                            <span key={i} className="text-xs text-mango">★</span>
                          ))}
                          <span className="text-xs text-gray-600">★</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        An absolute masterpiece with incredible world-building and character development.
                      </p>
                      <p className="text-xs text-muted-foreground">2024-01-15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Favorite Mangas */}
          <div>
            <h2 className="text-xl font-bold mb-4">Favorite Mangas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="border border-white/5 bg-card/20 backdrop-blur-md hover:border-mango/40 transition-colors cursor-pointer">
                <CardContent className="p-3">
                  <img 
                    src="https://cdn.myanimelist.net/images/manga/3/23186l.jpg" 
                    alt="Attack on Titan"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-medium text-sm mb-1">Attack on Titan</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-mango">★</span>
                    <span className="text-xs">9/10</span>
                  </div>
                  <p className="text-xs text-muted-foreground">139 ch</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
