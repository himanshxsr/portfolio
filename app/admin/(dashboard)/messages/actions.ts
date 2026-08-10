"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function updateMessageStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["new", "read", "replied", "archived"].includes(status)) {
    throw new Error("Invalid message status.");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error("Unable to update message.");

  revalidatePath("/admin/messages");
}
