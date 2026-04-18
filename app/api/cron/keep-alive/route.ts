import { redis } from "@/utils/upstash-redis/redis";
import { supabaseAdmin } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: { redis: string; supabase: string } = { redis: "", supabase: "" };

  try {
    const pong = await redis.ping();
    results.redis = pong ?? "ok";
  } catch (e) {
    results.redis = `error: ${e}`;
  }

  try {
    const { count } = await supabaseAdmin.from("manga").select("*", { count: "exact", head: true });
    results.supabase = `connected (${count} rows)`;
  } catch (e) {
    results.supabase = `error: ${e}`;
  }

  return Response.json(results);
}