"use client";
"use client";

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavbarActions } from './navbar-context';

export function Navbar() {
  const pathname = usePathname();

  const publicLinks = [
    { name: 'Search', href: '/search' },
    { name: 'Browse', href: '/browse' },
  ];

  const protectedLinks = [
    { name: 'Library', href: '/library' },
    { name: 'Assistant', href: '/assistant' },
    { name: 'Profile', href: '/dashboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer" suppressHydrationWarning>
            <div className="text-3xl transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500" suppressHydrationWarning>🥭</div>
            <span className="font-black text-2xl tracking-tighter italic uppercase text-foreground" suppressHydrationWarning>
              Manga<span className="text-mango">Mangos</span>
            </span>
          </Link>
          
          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-10">
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
