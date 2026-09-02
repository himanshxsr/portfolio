"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_SECTIONS } from "@/lib/content/admin-nav";

export function AdminNav({
  badges = {},
}: {
  badges?: { unreadMessages?: number };
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav aria-label="Admin navigation" className="space-y-6 px-3 pb-6">
      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary/70">
            {section.title}
          </p>
          <div className="space-y-0.5">
            {section.items.map(({ href, label, icon: Icon, badgeKey }) => {
              const active = isActive(href);
              const badge =
                badgeKey === "unreadMessages"
                  ? badges.unreadMessages
                  : undefined;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-primary/15 font-medium text-primary"
                      : "text-text-secondary hover:bg-primary/8 hover:text-primary"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon size={17} className="shrink-0" />
                    <span className="truncate">{label}</span>
                  </span>
                  {badge ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-background">
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
