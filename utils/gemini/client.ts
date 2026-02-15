import { GoogleGenAI } from "@google/genai";

const mangosAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const groundingTool = {
    googleSearch: {},
};

const config = {
    tools: [groundingTool],
};

export default mangosAI;


export async function generateContent(prompt: string, systemInstruction?: string) {
    const response = await mangosAI.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            tools: config.tools,
        }
    });

    for await (const chunk of response) {
        console.log(chunk.text);
    }
}
