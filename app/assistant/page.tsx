"use client";

import { useState, useRef, useEffect } from "react";
import { 
    Send, 
    Bot, 
    User, 
    Trash2, 
    ArrowLeft,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
    role: "user" | "model";
    parts: { text: string }[];
}

export default function AssistantPage() {
    const [input, setInput] = useState("");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [history, setHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        
        const newHistory: Message[] = [
            ...history,
            { role: "user", parts: [{ text: userMessage }] }
        ];
        
        setHistory(newHistory);
        setIsLoading(true);

        try {
            const response = await fetch("/api/assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: userMessage, 
                    history: history,
                    systemInstruction: systemPrompt.trim() || undefined
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to get response (${response.status})`);
            }

            // Check if it is a JSON response (like an error) instead of a stream
            const contentType = response.headers.get("Content-Type");
            if (contentType?.includes("application/json")) {
                const data = await response.json();
                throw new Error(data.error || "Received unexpected non-stream response");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            // Add an empty model message to start streaming into
            setHistory(prev => [...prev, { role: "model", parts: [{ text: "" }] }]);

            if (!reader) throw new Error("Stream reader not available");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                setHistory(prev => {
                    const lastMessage = prev.at(-1);
                    if (lastMessage?.role === "model") {
                        return [
                            ...prev.slice(0, -1),
                            { ...lastMessage, parts: [{ text: accumulatedText }] }
                        ];
                    }
                    return prev;
                });
            }

        } catch (error: any) {
            console.error("Chat Error:", error);
            setHistory(prev => {
                // Remove the empty model message if it exists at the end
                const last = prev.at(-1);
                const base = (last?.role === "model" && !last.parts[0].text) ? prev.slice(0, -1) : prev;
                return [
                    ...base, 
                    { role: "model", parts: [{ text: `[System Error]: ${error.message || "Failed to connect to the assistant."}` }] }
                ];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <div className="fixed inset-0 bg-background overflow-hidden selection:bg-mango/30 flex flex-col pt-16 md:pt-20" suppressHydrationWarning>
            <div className="fixed inset-0 manga-grid opacity-[0.03] pointer-events-none" suppressHydrationWarning />
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-mango/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-mango/5 blur-[120px] rounded-full pointer-events-none" />

            <main className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col px-4 pb-4 md:pb-8 overflow-hidden">
                <header className="mb-4 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-700 shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-mango transition-all group">
                            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" suppressHydrationWarning />
                            Back to Home
                        </Link>
                        <div className="flex items-center gap-3">
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
                                Mango<span className="text-mango">Assistant</span>
                            </h1>
                            <div className="absolute -top-4 -right-8 w-12 h-12 border-t-2 border-r-2 border-mango/20 hidden md:block" />
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                             <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.2em] rounded-full px-4 h-8 bg-white/5 border-white/5 transition-all hover:border-mango/30",
                                    showAdvanced ? "text-mango border-mango/20 shadow-[0_0_15px_rgba(255,159,67,0.1)]" : "text-muted-foreground/40"
                                )}
                            >
                                {showAdvanced ? "Hide Controls" : "Custom Instructions"}
                            </Button>
                        </div>
                    </div>

                    {showAdvanced && (
                        <div className="mt-6 p-6 bg-mango/5 border-l-2 border-mango rounded-r-3xl animate-in slide-in-from-left-4 fade-in duration-500">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-mango mb-4 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" suppressHydrationWarning />
                                System Configuration
                            </h3>
                            <textarea 
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                placeholder="Specify assistant personality, response style, or knowledge constraints..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs font-mono text-foreground placeholder:text-muted-foreground/20 focus:border-mango/30 outline-none transition-colors min-h-[80px] resize-none"
                            />
                            <p className="mt-2 text-[10px] text-muted-foreground/40 italic font-medium">
                                Note: Custom instructions will override the default Mango Assistant personality.
                            </p>
                        </div>
                    )}
                </header>

                <div className="flex-1 min-h-0 bg-card/10 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] relative group">
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-mango/5 to-transparent pointer-events-none" />
                    
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-6 md:p-12 space-y-12 relative"
                    >
                        {history.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-12 py-20">
                                <div className="relative group/bot">
                                    <div className="absolute -inset-4 bg-mango/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover/bot:opacity-100 transition-opacity duration-700" />
                                    <div className="w-20 h-20 rounded-[2rem] bg-black/40 flex items-center justify-center border border-white/10 shadow-2xl relative z-10 transform group-hover/bot:rotate-12 transition-transform duration-500">
                                        <Bot className="w-10 h-10 text-mango" suppressHydrationWarning />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-mango rounded-full flex items-center justify-center shadow-lg border-4 border-background z-20">
                                        <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-4 max-w-sm">
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">Manga Mangos Assistant</h2>
                                    <p className="text-muted-foreground font-medium italic text-sm leading-relaxed px-8">
                                        Ready to help with your manga questions, series recommendations, and more.
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
                                                ? "bg-mango border-white/20 text-black translate-y-4 group-hover/msg:-translate-y-2 group-hover/msg:rotate-12" 
                                                : "bg-white/5 border-white/5 text-muted-foreground translate-y-4 group-hover/msg:-translate-y-2 group-hover/msg:-rotate-12"
                                        )}>
                                            {msg.role === "user" ? <User className="w-6 h-6" suppressHydrationWarning /> : <Bot className="w-6 h-6 text-mango" suppressHydrationWarning />}
                                        </div>
                                        <div className={cn(
                                            "max-w-[85%] md:max-w-[70%] space-y-3",
                                            msg.role === "user" ? "text-right" : "text-left"
                                        )}>
                                            <div className={cn(
                                                "p-8 rounded-[2.5rem] text-sm md:text-base leading-relaxed tracking-tight relative overflow-hidden",
                                                msg.role === "user" 
                                                    ? "bg-mango/[0.03] border border-mango/10 text-foreground font-bold rounded-tr-none shadow-[0_8px_32px_rgba(255,159,67,0.05)]" 
                                                    : "bg-white/[0.02] border border-white/5 text-muted-foreground/90 font-medium rounded-tl-none shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                                            )}>
                                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay manga-grid" />
                                                
                                                {msg.parts[0].text ? (
                                                    <div className="relative z-10 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5 prose-code:text-mango prose-strong:text-foreground prose-headings:text-foreground prose-a:text-mango hover:prose-a:underline">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {msg.parts[0].text}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2 p-2">
                                                        <div className="w-2.5 h-2.5 bg-mango/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                        <div className="w-2.5 h-2.5 bg-mango/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                        <div className="w-2.5 h-2.5 bg-mango/40 rounded-full animate-bounce" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 px-4 font-black uppercase italic tracking-[0.4em] text-[8px] opacity-20 group-hover/msg:opacity-60 transition-opacity">
                                                <div className="h-[1px] flex-1 bg-current" />
                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-mango to-mango-secondary rounded-[2.5rem] blur-2xl opacity-0 group-focus-within/input:opacity-20 transition-opacity duration-1000" />
                            
                            <div className="relative flex items-end gap-4 bg-black/60 backdrop-blur-3xl border-2 border-white/5 rounded-[2.5rem] p-4 pr-6 transition-all duration-500 focus-within:border-mango/40 focus-within:bg-black/40">
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
                                        className="rounded-2xl bg-mango text-black font-black uppercase tracking-widest text-[10px] h-12 w-12 p-0 hover:scale-110 active:scale-95 transition-all shadow-[0_8px_32px_rgba(255,159,67,0.2)] disabled:opacity-20 disabled:grayscale"
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
        </div>
    );
}
