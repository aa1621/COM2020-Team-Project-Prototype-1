import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const publishable = process.env.SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !publishable || !secret) {
    throw new Error("Missing Supabase environment variables");
}

export const supabaseUser = createClient(url, publishable);
export const supabaseAdmin = createClient(url, secret);
