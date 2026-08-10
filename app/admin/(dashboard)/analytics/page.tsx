import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminAnalyticsPage() {
  const supabase = await createServerSupabaseClient();
  // This dynamic server page intentionally calculates a rolling analytics window.
  // eslint-disable-next-line react-hooks/purity
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("page_views")
    .select("path,referrer_host,device_class,viewed_at")
    .gte("viewed_at", since)
    .order("viewed_at", { ascending: false })
    .limit(10000);

  const views = data ?? [];
  const byPath = Object.entries(
    views.reduce<Record<string, number>>((totals, view) => {
      totals[view.path] = (totals[view.path] ?? 0) + 1;
      return totals;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const devices = Object.entries(
    views.reduce<Record<string, number>>((totals, view) => {
      totals[view.device_class] = (totals[view.device_class] ?? 0) + 1;
      return totals;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const referrers = Object.entries(
    views.reduce<Record<string, number>>((totals, view) => {
      const key = view.referrer_host || "Direct";
      totals[key] = (totals[key] ?? 0) + 1;
      return totals;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-sm text-primary">Last 30 days</p>
        <h1 className="mt-2 text-3xl font-bold">Visitor analytics</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Privacy-conscious page, device, and referrer totals. Raw IP addresses
          are not stored.
        </p>
      </div>
      <div className="rounded-xl border border-border-subtle bg-surface p-6">
        <p className="text-4xl font-bold text-primary">{views.length}</p>
        <p className="mt-2 text-sm text-text-secondary">Page views</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ["Popular pages", byPath],
          ["Devices", devices],
          ["Referrers", referrers],
        ].map(([title, rows]) => (
          <section
            key={title as string}
            className="rounded-xl border border-border-subtle bg-surface p-5"
          >
            <h2 className="font-semibold">{title as string}</h2>
            <div className="mt-4 space-y-3">
              {(rows as [string, number][]).map(([label, count]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="min-w-0 truncate text-text-secondary">
                    {label}
                  </span>
                  <span className="font-mono text-primary">{count}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
