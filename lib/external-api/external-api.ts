const BASE_URL = "https://api.jikan.moe/v4/"


export async function mangaFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`)
    const data = await res.json()
    
    if (!res.ok) {
        const error = data as JikanJsonError
        throw new Error(`Jikan API Error: ${error.message || res.statusText}`)
    }
    
    return data as T
}


// interface for the json error response from jikan api
export interface JikanJsonError {
    status: number,
    type: string,
    message: string,
    error: string,
    report_url: string
}