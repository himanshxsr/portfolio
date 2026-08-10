import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <section className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
        <p className="mb-2 font-mono text-sm text-primary">
          Portfolio CMS
        </p>
        <h1 className="mb-2 text-3xl font-bold text-text-primary">
          Admin sign in
        </h1>
        <p className="mb-7 text-sm leading-relaxed text-text-secondary">
          Manage published content, drafts, media, messages, and analytics.
        </p>
        {configured ? (
          <LoginForm />
        ) : (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            Supabase is not configured yet. Add the variables documented in
            <code className="mx-1 font-mono">.env.example</code>.
          </div>
        )}
      </div>
    </section>
  );
}
