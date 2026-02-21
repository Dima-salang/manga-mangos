"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
    Send, 
    Bot, 
    User, 
    X, 
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "./ChatContext";

export function AssistantSidebar() {
    const { history, isLoading, isOpen, setIsOpen, sendMessage, clearHistory, user } = useChat();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
                className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-mango flex items-center justify-center shadow-[0_8px_32px_rgba(255,159,67,0.4)] hover:shadow-[0_12px_48px_rgba(255,159,67,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 z-50 group"
                title="Mango Assistant"
            >
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Bot className="w-7 h-7 text-black" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full border-2 border-mango flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-mango rounded-full animate-pulse" />
                </div>
            </button>
        );
    }

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-background/80 backdrop-blur-3xl border-l border-white/5 shadow-[-32px_0_128px_-16px_rgba(0,0,0,0.5)] z-[100] flex flex-col animate-in slide-in-from-right duration-500 ease-out">
            {/* Header */}
            <header className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-mango flex items-center justify-center">
                        <Bot className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black italic uppercase tracking-wider text-foreground">Mango Assistant</h3>
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

            {/* Chat Body */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scrollbar-hide relative"
            >
                <div className="absolute inset-0 manga-grid opacity-[0.02] pointer-events-none" />
                
                {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Bot className="w-8 h-8 text-mango" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-lg font-black italic uppercase text-foreground">Mango Assistant</h4>
                            <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                                Curious about a manga? Looking for recommendations? I'm here to help!
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 w-full max-w-[240px]">
                            {["Top manga this week?", "Suggest some action manga", "What is MangaMangos?"].map((suggestion) => (
                                <button 
                                    key={suggestion}
                                    onClick={() => {
                                        setInput(suggestion);
                                        // Auto-send could be added here
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest p-3 rounded-xl bg-white/5 border border-white/5 hover:border-mango/30 hover:bg-mango/5 text-muted-foreground/60 transition-all text-left"
                                >
                                    {suggestion}
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
                                    "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border transition-all duration-500",
                                    msg.role === "user" 
                                        ? "bg-mango border-white/20 text-black translate-y-2" 
                                        : "bg-white/5 border-white/5 text-muted-foreground translate-y-2"
                                )}>
                                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-mango" />}
                                </div>
                                <div className={cn(
                                    "max-w-[85%] space-y-2",
                                    msg.role === "user" ? "text-right" : "text-left"
                                )}>
                                    <div className={cn(
                                        "p-4 rounded-2xl text-xs leading-relaxed tracking-tight relative overflow-hidden",
                                        msg.role === "user" 
                                            ? "bg-mango/[0.05] border border-mango/10 text-foreground font-bold rounded-tr-none" 
                                            : "bg-white/[0.03] border border-white/5 text-muted-foreground/90 font-medium rounded-tl-none"
                                    )}>
                                        {msg.parts[0].text ? (
                                            <div className="prose prose-invert prose-xs max-w-none prose-p:leading-relaxed prose-pre:bg-black/40 prose-code:text-mango">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.parts[0].text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1.5 p-1">
                                                <div className="w-2 h-2 bg-mango/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-2 h-2 bg-mango/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-2 h-2 bg-mango/40 rounded-full animate-bounce" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-20 block px-2">
                                        {msg.role === "user" ? "User" : "Assistant"}
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
                    <div className="absolute -inset-1 bg-mango/20 rounded-[1.5rem] blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative flex items-end gap-3 bg-black/40 border border-white/10 rounded-[1.5rem] p-2 pr-3 transition-all duration-300 focus-within:border-mango/40">
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
                                className="rounded-xl bg-mango text-black font-black uppercase tracking-widest text-[8px] h-10 w-10 p-0 hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
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
