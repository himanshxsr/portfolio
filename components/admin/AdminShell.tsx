import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { logout } from "@/app/admin/login/actions";

export function AdminShell({
  children,
  email,
  unreadMessages = 0,
}: {
  children: React.ReactNode;
  email: string;
  unreadMessages?: number;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="border-b border-border-subtle bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="border-b border-border-subtle px-5 py-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Portfolio CMS
          </p>
          <p className="mt-1 max-w-[220px] truncate text-xs text-text-secondary">
            {email}
          </p>
        </div>

        <div className="hidden flex-1 overflow-y-auto lg:block">
          <AdminNav badges={{ unreadMessages }} />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border-subtle px-5 py-4 lg:flex-col lg:items-stretch">
          <Link
            href="/"
            target="_blank"
            className="text-center text-xs text-text-secondary transition hover:text-primary lg:rounded-lg lg:border lg:border-border-subtle lg:px-3 lg:py-2"
          >
            View live site ↗
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-lg border border-border-subtle px-3 py-2 text-xs text-text-secondary transition hover:border-primary/30 hover:text-primary"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="overflow-x-auto border-t border-border-subtle px-1 py-3 lg:hidden">
          <AdminNav badges={{ unreadMessages }} />
        </div>
      </aside>

      <main className="min-w-0">
        <div className="px-5 py-6 sm:px-8 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
