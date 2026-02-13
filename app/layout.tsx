import type { Metadata } from 'next'
import { ClerkProvider, SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'MangaMangos | Your Ultimate Manga Hub',
  description: 'Track and discover your favorite manga.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${outfit.variable} font-sans antialiased text-foreground bg-background`}>
          <header className="fixed top-0 right-0 p-6 z-50 flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-mango text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-mango/20">
                  Join
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "h-10 w-10 border-2 border-mango shadow-[0_0_15px_rgba(255,159,67,0.2)]" } }} />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}