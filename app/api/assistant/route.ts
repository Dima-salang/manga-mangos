import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const { message, history, systemInstruction } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500 });
        }

        const mangosAI = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const defaultSystemInstruction = "You are the MangaMangos Assistant, a helpful and enthusiastic AI built for manga fans. You provide recommendations, answer questions about manga, and have a deep knowledge of various genres. Your tone is professional yet 'cool' and 'manga-inspired'. Use emojis like 🥭, 📚, and ✨ sparingly.";

        const result = await mangosAI.models.generateContentStream({
            model: "gemini-2.5-flash-lite",
            contents: [
                ...(history || []).map((h: any) => ({
                    role: h.role === "assistant" ? "model" : h.role,
                    parts: h.parts
                })),
                { role: "user", parts: [{ text: message }] }
            ],
            config: {
                systemInstruction: systemInstruction || defaultSystemInstruction,
                tools: [{ googleSearch: {} }]
            }
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    console.log("Stream started with gemini-2.5-flash");
                    for await (const chunk of result) {
                        const text = chunk.text;
                        if (text) {
                            console.log(`Stream chunk received: ${text.length} characters`);
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                    console.log("Stream completed successfully");
                } catch (e: any) {
                    console.error("Critical Stream Error:", e);
                    const errorMessage = `\n\n[Error]: ${e.message || "The AI encountered an issue during streaming."}`;
                    controller.enqueue(encoder.encode(errorMessage));
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });

    } catch (error: any) {
        console.error("AI Assistant Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Failed to generate response" }), { status: 500 });
    }
}
