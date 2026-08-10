import { createBrowserClient } from "@supabase/ssr";
import {
  assertSupabaseConfigured,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
} from "./config";

export function createBrowserSupabaseClient() {
  assertSupabaseConfigured();
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
