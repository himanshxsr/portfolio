import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return <AdminShell email={user.email ?? "Administrator"}>{children}</AdminShell>;
}
