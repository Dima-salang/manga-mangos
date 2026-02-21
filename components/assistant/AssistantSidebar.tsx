"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
    Send, 
    Bot, 
    User, 
    X, 
    Trash2,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "./ChatContext";
import { PERSONA_CONFIGS } from "@/types/chat";

import { PersonaAvatar } from "./PersonaAvatar";

export function AssistantSidebar() {
    const { history, isLoading, isOpen, setIsOpen, sendMessage, clearHistory, user, persona, setPersona } = useChat();
    const pathname = usePathname();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const activePersona = PERSONA_CONFIGS.find(p => p.id === persona) || PERSONA_CONFIGS[0];

    const scrollToBottom = (force = false) => {
        if (!scrollRef.current) return;
        const scrollContainer = scrollRef.current;
        const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop <= scrollContainer.clientHeight + 200;
        
        if (force || isNearBottom) {
            scrollContainer.scrollTo({
                top: scrollContainer.scrollHeight,
                behavior: force ? "auto" : "smooth"
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom(true);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    // Don't render the sidebar if we are on the assistant page
    if (pathname?.startsWith("/assistant")) {
        return null;
    }

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const message = input.trim();
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        await sendMessage(message);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{ backgroundColor: activePersona.accent, boxShadow: `0 8px 32px ${activePersona.glow}` }}
                className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50 group"
                title="Mango Assistant"
            >
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <PersonaAvatar 
                    src={activePersona.avatar}
                    alt={activePersona.name}
                    fallbackIcon={Bot}
                    className="w-8 h-8 rounded-lg"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full border-2 flex items-center justify-center" style={{ borderColor: activePersona.accent }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activePersona.accent }} />
                </div>
            </button>
        );
    }

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-background/80 backdrop-blur-3xl border-l border-white/5 shadow-[-32px_0_128px_-16px_rgba(0,0,0,0.5)] z-[100] flex flex-col animate-in slide-in-from-right duration-500 ease-out">
            {/* Header */}
            <header className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500 overflow-hidden relative" style={{ backgroundColor: activePersona.accent }}>
                        <PersonaAvatar 
                            src={activePersona.avatar}
                            alt={activePersona.name}
                            fallbackIcon={Bot}
                            className="p-0.5"
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-black italic uppercase tracking-wider text-foreground">{activePersona.name} Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={clearHistory}
                        className="w-8 h-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground/40 transition-colors"
                        title="Clear History"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Persona Selector */}
            <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 shrink-0 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {PERSONA_CONFIGS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setPersona(p.id)}
                            className={cn(
                                "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 group/p relative",
                                persona === p.id 
                                    ? "bg-white/10 scale-105" 
                                    : "hover:bg-white/5 opacity-40 hover:opacity-100"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-lg relative overflow-hidden transition-all duration-500",
                                persona === p.id ? "ring-2 ring-offset-2 ring-offset-background" : ""
                            )} style={{ ringColor: persona === p.id ? p.accent : 'transparent' } as any}>
                                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", p.color)} />
                                <PersonaAvatar 
                                    src={p.avatar}
                                    alt={p.name}
                                    fallbackEmoji={p.emoji}
                                    className="z-10 group-hover/p:scale-110 transition-transform"
                                />
                            </div>
                            <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest transition-colors duration-500",
                                persona === p.id ? "" : "text-muted-foreground"
                            )} style={{ color: persona === p.id ? p.accent : undefined }}>
                                {p.name}
                            </span>
                            {persona === p.id && (
                                <div className="absolute -top-1 -right-1">
                                    <Sparkles className="w-3 h-3 animate-pulse" style={{ color: p.accent }} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Body */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scrollbar-hide relative"
            >
                <div className="absolute inset-0 manga-grid opacity-[0.02] pointer-events-none" />
                
                {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform duration-700 hover:rotate-6 overflow-hidden relative shadow-2xl">
                            <PersonaAvatar 
                                src={activePersona.avatar}
                                alt={activePersona.name}
                                fallbackIcon={Bot}
                                className="p-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-lg font-black italic uppercase text-foreground">{activePersona.name} Assistant</h4>
                            <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                                Curious about a manga? Looking for recommendations? I'm here to help{user?.firstName ? `, ${user.firstName}` : "" }!
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 w-full max-w-[240px]">
                            {["Top manga this week?", "Suggest some action manga", "What is MangaMangos?"].map((suggestion) => (
                                <button 
                                    key={suggestion}
                                    onClick={() => {
                                        setInput(suggestion);
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.08] text-muted-foreground/60 transition-all text-left group/suggest"
                                    style={{ '--hover-border': activePersona.accent } as any}
                                >
                                    <span className="group-hover/suggest:text-foreground transition-colors">{suggestion}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {history.map((msg, i) => (
                            <div 
                                key={`${msg.role}-${i}`} 
                                className={cn(
                                    "flex gap-4 group/msg animate-in fade-in slide-in-from-bottom-4 duration-500",
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border transition-all duration-500 overflow-hidden relative",
                                    msg.role === "user" 
                                        ? "border-white/20 text-black translate-y-2" 
                                        : "bg-white/5 border-white/5 translate-y-2"
                                )} style={{ 
                                    backgroundColor: msg.role === "user" ? activePersona.accent : undefined,
                                    color: msg.role === "model" ? activePersona.accent : undefined
                                }}>
                                    {msg.role === "user" ? <User className="w-4 h-4" /> : (
                                        <PersonaAvatar 
                                            src={activePersona.avatar}
                                            alt={activePersona.name}
                                            fallbackIcon={Bot}
                                        />
                                    )}
                                </div>
                                <div className={cn(
                                    "max-w-[85%] space-y-2",
                                    msg.role === "user" ? "text-right" : "text-left"
                                )}>
                                    <div className={cn(
                                        "p-4 rounded-2xl text-xs leading-relaxed tracking-tight relative overflow-hidden transition-colors duration-500",
                                        msg.role === "user" 
                                            ? "text-foreground font-bold rounded-tr-none" 
                                            : "bg-white/[0.03] border border-white/5 text-muted-foreground/90 font-medium rounded-tl-none"
                                    )} style={{ 
                                        backgroundColor: msg.role === "user" ? activePersona.glow : undefined,
                                        borderColor: msg.role === "user" ? `${activePersona.accent}33` : undefined 
                                    }}>
                                        {msg.parts[0].text ? (
                                            <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-pre:bg-black/40" style={{ '--tw-prose-code': activePersona.accent } as any}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.parts[0].text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1.5 p-1">
                                                <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: activePersona.accent }} />
                                                <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: activePersona.accent }} />
                                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: activePersona.accent }} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-20 block px-2">
                                        {msg.role === "user" ? (user?.firstName || user?.username || "You") : "Assistant"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input Footer */}
            <footer className="p-6 shrink-0 bg-gradient-to-t from-background via-background to-transparent pt-10">
                <div className="relative group/input">
                    <div className="absolute -inset-1 rounded-[1.5rem] blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000" style={{ backgroundColor: activePersona.glow }} />
                    
                    <div className="relative flex items-end gap-3 bg-black/40 border border-white/10 rounded-[1.5rem] p-2 pr-3 transition-all duration-300 group-focus-within/input:border-opacity-100" style={{ borderColor: `${activePersona.accent}33` }}>
                        <textarea 
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Ask anything..."
                            rows={1}
                            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm font-bold text-foreground placeholder:text-muted-foreground/20 resize-none max-h-32 overflow-y-auto"
                        />
                        <div className="flex items-center pb-1">
                            <Button 
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="rounded-xl text-black font-black uppercase tracking-widest text-[8px] h-10 w-10 p-0 hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                                style={{ backgroundColor: activePersona.accent }}
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                <p className="text-[8px] text-center mt-4 text-muted-foreground/30 font-black uppercase tracking-[0.2em]">
                    Powered by MangoAI v2.5
                </p>
            </footer>

            {/* Backdrop overlay for small screens */}
            <button 
                type="button"
                className="fixed inset-0 bg-black/40 md:hidden -z-10 animate-in fade-in duration-300 w-full h-full border-none outline-none appearance-none"
                onClick={() => setIsOpen(false)}
                aria-label="Close sidebar"
            />
        </div>
    );
}
