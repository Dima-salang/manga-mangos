import { z } from "zod";

const BASE_URL = "https://api.jikan.moe/v4/"

const jikanErrorSchema = z.object({
    status: z.number(),
    type: z.string().optional(),
    message: z.string().optional(),
    error: z.string().optional(),
    report_url: z.string().optional()
});

export async function mangaFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`)
    
    if (!res.ok) {
        let errorMessage = res.statusText;
        try {
            const data = await res.json();
            const result = jikanErrorSchema.safeParse(data);
            if (result.success) {
                errorMessage = result.data.message || result.data.error || errorMessage;
            }
        } catch (e) {
            console.debug("Non-JSON error response from Jikan API:", e);
        }
        throw new Error(`Jikan API Error (${res.status}): ${errorMessage}`);
    }
    
    const data = await res.json();
    return data as T;
}


// interface for the json error response from jikan api
export interface JikanJsonError {
    status: number,
    type: string,
    message: string,
    error: string,
    report_url: string
}