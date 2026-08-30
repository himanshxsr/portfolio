import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!url || !serviceKey || !email || !password) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, and ADMIN_PASSWORD."
    );
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must contain at least 8 characters.");
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  let userId = created.user?.id;
  if (createError) {
    const { data } = await supabase.auth.admin.listUsers();
    userId = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    )?.id;

    if (userId) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password, email_confirm: true }
      );
      if (updateError) throw new Error(updateError.message);
    }
  }
  if (!userId) {
    throw new Error(createError?.message ?? "Unable to create admin account.");
  }

  const { error: adminError } = await supabase
    .from("admin_users")
    .upsert({ user_id: userId });
  if (adminError) throw new Error(adminError.message);

  console.log(`Admin account ready for ${email}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
