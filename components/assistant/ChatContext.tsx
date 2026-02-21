"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { AIPersonas } from "@/types/chat";

interface Message {
    role: "user" | "model";
    parts: { text: string }[];
}

interface ChatContextType {
    history: Message[];
    isLoading: boolean;
    isOpen: boolean;
    user: ReturnType<typeof useUser>["user"];
    isSignedIn: boolean | undefined;
    isLoaded: boolean;
    persona: string; // The ID/key of the persona (e.g. 'default', 'KUROHANA')
    setPersona: (persona: string) => void;
    setIsOpen: (open: boolean) => void;
    sendMessage: (message: string) => Promise<void>;
    clearHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { readonly children: ReactNode }) {
    const [history, setHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [personaKey, setPersonaKey] = useState<keyof typeof AIPersonas>("default");
    const { isSignedIn, user, isLoaded } = useUser();
    


    const sendMessage = async (userMessage: string) => {
        if (!userMessage.trim() || isLoading) return;

        const newHistory: Message[] = [
            ...history,
            { role: "user", parts: [{ text: userMessage }] }
        ];
        
        setHistory(newHistory);
        setIsLoading(true);

        try {
            // Provide context about the user if available
            const userContext = user ? `\n\nYou are talking to ${user.firstName || user.username || 'a user'}.` : '';
            console.log(userContext);
            
            const response = await fetch("/api/assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: userMessage, 
                    userId: user?.id,
                    history: history,
                    systemInstruction: userContext + (AIPersonas[personaKey] || AIPersonas.default) || undefined
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to get response (${response.status})`);
            }

            const contentType = response.headers.get("Content-Type");
            if (contentType?.includes("application/json")) {
                const data = await response.json();
                throw new Error(data.error || "Received unexpected response");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

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

    const value = useMemo(() => ({
        history,
        isLoading,
        isOpen,
        user,
        isSignedIn,
        isLoaded,
        persona: personaKey,
        setPersona: (key: string) => setPersonaKey(key as keyof typeof AIPersonas),
        setIsOpen,
        sendMessage,
        clearHistory
    }), [history, isLoading, isOpen, user, isSignedIn, isLoaded, personaKey]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}
