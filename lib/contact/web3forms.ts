const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export async function submitWeb3Form(input: {
  name: string;
  email: string;
  message: string;
}) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return { ok: false as const, reason: "missing_key" as const };

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      name: input.name,
      email: input.email,
      message: input.message,
      subject: `Portfolio Contact: ${input.name}`,
      from_name: "Portfolio Contact Form",
    }),
  });

  const data = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;

  return {
    ok: response.ok && Boolean(data?.success),
    reason: data?.message,
  };
}
