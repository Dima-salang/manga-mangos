"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 manga-grid opacity-10 pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-mango/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-mango/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center">
        {/* Unified Logo/Home Link */}
        <Link href="/" className="mb-8 flex items-center gap-3 group transition-all duration-500 hover:scale-105">
          <div className="text-5xl transition-transform group-hover:rotate-12 duration-300">🥭</div>
          <span className="font-black text-3xl tracking-tighter italic uppercase text-foreground">
            Manga<span className="text-mango">Mangos</span>
          </span>
        </Link>

        {/* Clerk Sign In Component */}
        <div className="relative group">
          {/* Professional Accent Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-mango/20 via-mango/40 to-mango/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-card/40 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[1.5rem]",
                headerTitle: "text-foreground font-black italic uppercase tracking-tight text-2xl",
                headerSubtitle: "text-muted-foreground font-medium",
                socialButtonsBlockButton: "bg-background/50 border border-white/5 hover:bg-white/5 transition-colors rounded-xl",
                formButtonPrimary: "bg-mango hover:bg-mango/90 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-mango/20",
                footerActionLink: "text-mango hover:text-mango/80 font-bold",
                formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1",
                formFieldInput: "bg-background/50 border-white/5 focus:border-mango/50 focus:ring-mango/20 rounded-xl h-12 transition-all",
                dividerLine: "bg-white/5",
                dividerText: "text-[10px] font-black uppercase tracking-widest text-muted-foreground/50",
                identityPreviewText: "text-foreground",
                identityPreviewEditButton: "text-mango"
              }
            }}
            routing="hash"
            signUpUrl="/register"
          />
        </div>

        {/* Bottom Decoration */}
        <div className="mt-12 opacity-5 select-none pointer-events-none flex flex-col items-center gap-2">
          <div className="text-sm font-black tracking-[1em] uppercase">V1.0_CORE</div>
          <div className="w-px h-12 bg-gradient-to-b from-mango to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
