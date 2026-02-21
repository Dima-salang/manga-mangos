"use client";

import { useState, useRef, useEffect } from "react";
import { 
    Send, 
    Bot, 
    User, 
    Trash2, 
    ArrowLeft,
    Sparkles,
    Settings,
    X
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useChat } from "@/components/assistant/ChatContext";
import { PERSONA_CONFIGS } from "@/types/chat";
import { ProfilePictureManager } from "@/components/assistant/ProfilePictureManager";

export default function AssistantPage() {
    const { history, isLoading, sendMessage, clearHistory, user, persona, setPersona } = useChat();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showProfileSettings, setShowProfileSettings] = useState(false);
    const [personaImages, setPersonaImages] = useState<Record<string, string | null>>({});

    const activePersona = PERSONA_CONFIGS.find(p => p.id === persona) || PERSONA_CONFIGS[0];
    const currentPersonaImage = personaImages[persona] || activePersona.image;

    const handlePersonaImageChange = (imageUrl: string | null) => {
        setPersonaImages(prev => ({
            ...prev,
            [persona]: imageUrl
        }));
    };

    const renderPersonaAvatar = (p: typeof PERSONA_CONFIGS[number], size: 'small' | 'large' = 'small') => {
        const imageForPersona = personaImages[p.id] || p.image;
        const sizeClasses = size === 'small' ? 'w-12 h-12' : 'w-20 h-20';
        const textSizeClasses = size === 'small' ? 'text-3xl' : 'text-5xl';
        
        if (imageForPersona) {
            return (
                <img 
                    src={imageForPersona} 
                    alt={`${p.name} avatar`} 
                    className={`w-full h-full object-cover rounded-${size === 'small' ? '2xl' : '[2rem]'}`}
                />
            );
        }
        
        return (
            <>
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", p.color)} />
                <span className={cn("relative z-10", textSizeClasses)}>{p.emoji}</span>
            </>
        );
    };

    // Modern auto-scroll logic
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
        scrollToBottom();
    }, [history]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        
        await sendMessage(userMessage);
    };

    return (
        <div 
            className="fixed inset-0 bg-background overflow-hidden flex flex-col pt-16 md:pt-20 transition-colors duration-1000 persona-selection" 
            style={{ 
                '--persona-accent': activePersona.accent,
                '--persona-glow': activePersona.glow 
            } as any} 
            suppressHydrationWarning
        >
            <style jsx global>{`
                .persona-selection::selection {
                    background-color: var(--persona-accent);
                    color: black;
                }
            `}</style>
            <div className="fixed inset-0 manga-grid opacity-[0.03] pointer-events-none" suppressHydrationWarning />
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000" style={{ backgroundColor: 'var(--persona-glow)' }} />
            <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000" style={{ backgroundColor: 'var(--persona-glow)' }} />

            <main className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col px-4 pb-4 md:pb-8 overflow-hidden">
                <header className="mb-4 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-700 shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <Link href="/browse" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 transition-all group" style={{ color: activePersona.accent }}>
                            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" suppressHydrationWarning />
                            Back to Home
                        </Link>
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setShowProfileSettings(true)}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground hover:bg-white/5 transition-all rounded-full px-4"
                                style={{ color: activePersona.accent }}
                            >
                                <Settings className="w-3 h-3 mr-2" suppressHydrationWarning />
                                Profile
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={clearHistory}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all rounded-full px-4"
                            >
                                <Trash2 className="w-3 h-3 mr-2" suppressHydrationWarning />
                                Clear History
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="relative">
                            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-2 mix-blend-difference">
                                {activePersona.name}<span style={{ color: activePersona.accent }}>Assistant</span>
                            </h1>
                            <div className="absolute -top-4 -right-8 w-12 h-12 border-t-2 border-r-2 hidden md:block" style={{ borderColor: `${activePersona.accent}33` }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                        {PERSONA_CONFIGS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPersona(p.id)}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-500 group/p relative overflow-hidden",
                                    persona === p.id 
                                        ? "bg-white/[0.05] ring-1" 
                                        : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]"
                                )}
                                style={{ 
                                    borderColor: persona === p.id ? p.accent : undefined,
                                    boxShadow: persona === p.id ? `0 0 30px ${p.glow}` : undefined,
                                    ringColor: persona === p.id ? p.accent : undefined
                                } as any}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-xl relative overflow-hidden transition-transform duration-500 group-hover/p:scale-110 group-hover/p:rotate-3",
                                    persona === p.id ? "scale-110" : "grayscale opacity-50 group-hover/p:grayscale-0 group-hover/p:opacity-100"
                                )}>
                                    {renderPersonaAvatar(p)}
                                </div>
                                <div className="text-center space-y-0.5 relative z-10">
                                    <h4 className={cn(
                                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                                        persona === p.id ? "" : "text-muted-foreground"
                                    )} style={{ color: persona === p.id ? p.accent : undefined }}>
                                        {p.name}
                                    </h4>
                                    <p className="text-[8px] font-bold text-muted-foreground/40 italic line-clamp-1 group-hover/p:text-muted-foreground/60 transition-colors">
                                        {p.description}
                                    </p>
                                </div>
                                {persona === p.id && (
                                    <div className="absolute top-2 right-2">
                                        <Sparkles className="w-3 h-3 animate-pulse" style={{ color: p.accent }} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>


                </header>

                <div className="flex-1 min-h-0 bg-card/10 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] relative group">
                    <div className="absolute inset-x-0 top-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${activePersona.glow}, transparent)` }} />
                    
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-6 md:p-12 space-y-12 relative"
                    >
                        {history.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-12 py-20">
                                <div className="relative group/bot">
                                    <div className="absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-0 group-hover/bot:opacity-100 transition-opacity duration-700" style={{ backgroundColor: activePersona.glow }} />
                                    <div className="w-20 h-20 rounded-[2rem] bg-black/40 flex items-center justify-center border border-white/10 shadow-2xl relative z-10 transform group-hover/bot:rotate-12 transition-transform duration-500 overflow-hidden">
                                        {currentPersonaImage ? (
                                            <img 
                                                src={currentPersonaImage} 
                                                alt="Assistant avatar" 
                                                className="w-full h-full object-cover rounded-[2rem]"
                                            />
                                        ) : (
                                            <Bot className="w-10 h-10" style={{ color: activePersona.accent }} suppressHydrationWarning />
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-4 border-background z-20" style={{ backgroundColor: activePersona.accent }}>
                                        <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-4 max-w-sm">
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">{activePersona.name} Assistant</h2>
                                    <p className="text-muted-foreground font-medium italic text-sm leading-relaxed px-8">
                                        Ready to help{user?.firstName ? ` you, ${user.firstName},` : ""} with your manga questions, series recommendations, and more.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto w-full flex flex-col gap-12">
                                {history.map((msg, i) => (
                                    <div 
                                        key={`${msg.role}-${i}`} 
                                        className={cn(
                                            "flex gap-4 md:gap-8 group/msg animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both",
                                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        )}
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center border transition-all duration-700",
                                            msg.role === "user" 
                                                ? "border-white/20 text-black translate-y-4 group-hover/msg:-translate-y-2 group-hover/msg:rotate-12" 
                                                : "bg-white/5 border-white/5 translate-y-4 group-hover/msg:-translate-y-2 group-hover/msg:-rotate-12"
                                        )} style={{ 
                                            backgroundColor: msg.role === "user" ? activePersona.accent : undefined,
                                            color: msg.role === "model" ? activePersona.accent : undefined
                                        }}>
                                            {msg.role === "user" ? <User className="w-6 h-6" suppressHydrationWarning /> : currentPersonaImage ? (
                                                <img 
                                                    src={currentPersonaImage} 
                                                    alt="Assistant avatar" 
                                                    className="w-full h-full object-cover rounded-2xl"
                                                />
                                            ) : (
                                                <Bot className="w-6 h-6" suppressHydrationWarning />
                                            )}
                                        </div>
                                        <div className={cn(
                                            "max-w-[85%] md:max-w-[70%] space-y-3",
                                            msg.role === "user" ? "text-right" : "text-left"
                                        )}>
                                            <div className={cn(
                                                "p-8 rounded-[2.5rem] text-sm md:text-base leading-relaxed tracking-tight relative overflow-hidden transition-colors duration-500",
                                                msg.role === "user" 
                                                    ? "text-foreground font-bold rounded-tr-none shadow-[0_8px_32px_rgba(0,0,0,0.05)]" 
                                                    : "bg-white/[0.02] border border-white/5 text-muted-foreground/90 font-medium rounded-tl-none shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                                            )} style={{ 
                                                backgroundColor: msg.role === "user" ? activePersona.glow : undefined,
                                                borderColor: msg.role === "user" ? `${activePersona.accent}33` : undefined
                                            }}>
                                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay manga-grid" />
                                                
                                                {msg.parts[0].text ? (
                                                    <div className="relative z-10 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5 prose-strong:text-foreground prose-headings:text-foreground hover:prose-a:underline" style={{ '--tw-prose-code': activePersona.accent, '--tw-prose-links': activePersona.accent } as any}>
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {msg.parts[0].text}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 p-2" style={{ color: activePersona.accent }}>
                                                        <div className="w-2.5 h-2.5 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: activePersona.accent }} />
                                                        <div className="w-2.5 h-2.5 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: activePersona.accent }} />
                                                        <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: activePersona.accent }} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 px-4 font-black uppercase italic tracking-[0.4em] text-[8px] opacity-20 group-hover/msg:opacity-60 transition-opacity">
                                                <span className="shrink-0">{msg.role === "user" ? (user?.firstName || user?.username || "You") : "Assistant"}</span>
                                                <div className="h-[1px] flex-1 bg-current" />
                                                <span className="shrink-0">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sticky Bottom Area */}
                    <div className="px-6 pb-6 md:px-12 md:pb-12 pt-0 shrink-0 relative">
                        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none -z-10" />
                        
                        <div className="relative group/input max-w-4xl mx-auto">
                            {/* Input Glow */}
                            <div className="absolute -inset-1.5 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-1000" style={{ backgroundColor: activePersona.accent }} />
                            
                            <div className="relative flex items-end gap-4 bg-black/60 backdrop-blur-3xl border-2 border-white/5 rounded-[2.5rem] p-4 pr-6 transition-all duration-500 group-focus-within/input:bg-black/40" style={{ borderColor: `${activePersona.accent}33` }}>
                                <textarea 
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Message Mango Assistant..."
                                    rows={1}
                                    className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-sm md:text-base font-bold text-foreground placeholder:text-muted-foreground/10 resize-none max-h-40 overflow-y-auto"
                                />
                                <div className="flex items-center pb-1">
                                    <Button 
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="rounded-2xl text-black font-black uppercase tracking-widest text-[10px] h-12 w-12 p-0 hover:scale-110 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
                                        style={{ backgroundColor: activePersona.accent, boxShadow: `0 8px 32px ${activePersona.glow}` }}
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" suppressHydrationWarning />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Profile Settings Modal */}
            {showProfileSettings && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-card border border-white/10 rounded-[2.5rem] max-w-md w-full p-8 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter" style={{ color: activePersona.accent }}>
                                {activePersona.name} Profile
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowProfileSettings(false)}
                                className="w-8 h-8 p-0 rounded-full hover:bg-white/10"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                                    Assistant Avatar
                                </h4>
                                <ProfilePictureManager
                                    currentImage={currentPersonaImage}
                                    emoji={activePersona.emoji}
                                    onImageChange={handlePersonaImageChange}
                                    accentColor={activePersona.accent}
                                />
                            </div>
                            
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-muted-foreground italic">
                                    Upload a custom PNG image to replace the default emoji avatar. 
                                    Images are stored locally in your browser session.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
