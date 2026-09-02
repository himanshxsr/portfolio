import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateMessageStatus } from "./actions";

export default async function AdminMessagesPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const messages = data ?? [];
  const unread = messages.filter((message) => message.status === "new").length;

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[
          { label: "Overview", href: "/admin" },
          { label: "Messages" },
        ]}
      />

      <AdminPageHeader
        eyebrow="Inbox"
        title="Contact messages"
        description="Submissions from the public contact form. Delivery status is updated by Web3Forms and the auto-reply script."
      />

      <div className="flex flex-wrap gap-3 text-sm">
        <span className="rounded-full border border-border-subtle px-3 py-1">
          Total: {messages.length}
        </span>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
          Unread: {unread}
        </span>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <article
            key={message.id}
            className="rounded-xl border border-border-subtle bg-surface p-5"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="font-semibold">{message.name}</h2>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {message.email}
                </a>
              </div>
              <div className="text-xs text-text-secondary sm:text-right">
                <p>{new Date(message.created_at).toLocaleString()}</p>
                <p className="mt-1 capitalize">
                  Status: {message.status} · Delivery: {message.delivery_status}
                </p>
              </div>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {message.message}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["new", "read", "replied", "archived"].map((status) => (
                <form action={updateMessageStatus} key={status}>
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    disabled={message.status === status}
                    className="rounded-full border border-border-subtle px-3 py-1 text-xs capitalize disabled:border-primary/30 disabled:bg-primary/10 disabled:text-primary"
                  >
                    Mark {status}
                  </button>
                </form>
              ))}
            </div>
          </article>
        ))}
        {!messages.length && (
          <div className="rounded-xl border border-border-subtle bg-surface px-6 py-14 text-center text-text-secondary">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
