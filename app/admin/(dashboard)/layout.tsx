import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminDashboardStats } from "@/lib/content/admin-queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  const stats = await getAdminDashboardStats();
  return (
    <AdminShell
      email={user.email ?? "Administrator"}
      unreadMessages={stats.unreadMessages}
    >
      {children}
    </AdminShell>
  );
}
