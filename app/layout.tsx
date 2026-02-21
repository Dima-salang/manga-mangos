import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
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

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/app/components/navbar"
import { NavbarProvider } from "@/app/components/navbar-context"
import { ChatProvider } from "@/components/assistant/ChatContext"
import { AssistantSidebar } from "@/components/assistant/AssistantSidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${outfit.variable} font-sans antialiased text-foreground bg-background`} suppressHydrationWarning>
          <NavbarProvider>
            <ChatProvider>
              <TooltipProvider>
                <Navbar />
                {children}
                <AssistantSidebar />
                <Toaster />
              </TooltipProvider>
            </ChatProvider>
          </NavbarProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}