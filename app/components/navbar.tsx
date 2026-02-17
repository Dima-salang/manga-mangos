"use client";

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { NavbarActions } from './navbar-context';
import { Search } from 'lucide-react';
import { Kbd } from '@/components/ui/kbd';
import { Input } from '@/components/ui/input';

export function Navbar() {
  const pathname = usePathname();

  const publicLinks = [
    { name: 'Search', href: '/search' },
    { name: 'Browse', href: '/browse' },
  ];

  const protectedLinks = [
    { name: 'Library', href: '/library' },
    { name: 'Assistant', href: '/assistant' },
    { name: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer shrink-0" suppressHydrationWarning>
            <div className="text-3xl transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500" suppressHydrationWarning>🥭</div>
            <span className="font-black text-2xl tracking-tighter italic uppercase text-foreground hidden sm:block" suppressHydrationWarning>
              Manga<span className="text-mango">Mangos</span>
            </span>
          </Link>
          
          <div className="flex-1 flex items-center justify-center gap-8">
            {/* Main Navigation */}
            <div className="hidden lg:flex items-center">
              <ul className="flex gap-10 font-black text-[10px] uppercase tracking-[0.2em]">
                {publicLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className={cn(
                        "transition-colors hover:text-mango",
                        pathname === link.href ? "text-mango" : "text-muted-foreground/60"
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <SignedIn>
                  {protectedLinks.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href} 
                        className={cn(
                          "transition-colors hover:text-mango",
                          pathname === link.href ? "text-mango" : "text-muted-foreground/60"
                        )}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </SignedIn>
              </ul>
            </div>

            {/* Quick Search */}
            <NavSearch />
          </div>

          {/* Auth & Actions */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <NavbarActions />
              
              <div className="h-6 w-px bg-white/5 mx-2 hidden sm:block" />

              <SignedOut>
                <Link 
                  href="/login" 
                  className="text-sm font-bold uppercase tracking-widest hover:text-mango transition-colors cursor-pointer"
                  role="button"
                  aria-label="Sign In"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="bg-mango text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-mango/20"
                  role="button"
                  aria-label="Join"
                >
                  Join
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton appearance={{ elements: { userButtonAvatarBox: "h-10 w-10 border-2 border-mango shadow-[0_0_15px_rgba(255,159,67,0.2)]" } }} />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
function NavSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden sm:flex items-center group max-w-[240px] w-full">
      <div className="absolute inset-0 bg-white/5 rounded-xl border border-white/5 group-focus-within:border-mango/30 group-focus-within:bg-white/[0.08] transition-all duration-300 pointer-events-none" />
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground/40 group-focus-within:text-mango transition-colors pointer-events-none" />
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Quick search..."
        className="h-10 border-0 bg-transparent pl-10 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs font-bold placeholder:text-muted-foreground/20 italic tracking-wide"
      />
      <div className="absolute right-2 opacity-50 group-focus-within:opacity-100 transition-opacity pointer-events-none">
        <Kbd className="bg-white/5 border-white/10 text-[10px] h-6 px-1.5 font-black flex items-center gap-1">
          <span className="text-[12px] opacity-40">⌘</span>K
        </Kbd>
      </div>
    </form>
  );
}
