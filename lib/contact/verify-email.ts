export const EMAIL_FIELD = "email" as const;

export const EMAIL_ERRORS = {
  invalid:
    "Please enter a correct email address (e.g. name@example.com).",
  undeliverable:
    "This email doesn't look deliverable. Please enter a correct email address.",
  disposable:
    "Please use your real email address, not a temporary one.",
  domain:
    "This email domain can't receive mail. Please check and enter a correct email.",
} as const;

export type EmailVerificationFailure = {
  ok: false;
  error: string;
  field: typeof EMAIL_FIELD;
  suggestion?: string;
};

export type EmailVerificationResult =
  | { ok: true }
  | EmailVerificationFailure;

function fail(
  error: string,
  suggestion?: string
): EmailVerificationFailure {
  return {
    ok: false,
    error,
    field: EMAIL_FIELD,
    ...(suggestion ? { suggestion } : {}),
  };
}

/** Common misspelled email domains → correction */
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
  "iclod.com": "icloud.com",
  "proton.meil": "proton.me",
};

/** Block common disposable / throwaway providers */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "yopmail.com",
  "throwaway.email",
  "getnada.com",
  "maildrop.cc",
  "sharklasers.com",
  "trashmail.com",
  "fakeinbox.com",
  "dispostable.com",
]);

export function getEmailDomain(email: string) {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  return domain || null;
}

export function suggestEmailCorrection(email: string) {
  const [local, domain] = email.trim().split("@");
  if (!local || !domain) return null;

  const fixedDomain = DOMAIN_TYPOS[domain.toLowerCase()];
  if (!fixedDomain) return null;

  return `${local}@${fixedDomain}`;
}

export function isDisposableEmailDomain(domain: string) {
  return DISPOSABLE_DOMAINS.has(domain.toLowerCase());
}

export async function domainAcceptsMail(domain: string) {
  const { resolveMx, resolve4 } = await import("node:dns/promises");

  try {
    const mx = await resolveMx(domain);
    if (mx.length > 0) return true;
  } catch {
    // fall through — some domains only publish A records for mail
  }

  try {
    const a = await resolve4(domain);
    return a.length > 0;
  } catch {
    return false;
  }
}

type AbstractReputationResponse = {
  suggested_correction?: string | null;
  email_deliverability?: {
    status?: string;
    status_detail?: string;
  };
  email_quality?: {
    is_disposable?: boolean | null;
  };
};

async function verifyWithAbstractApi(
  email: string,
  apiKey: string
): Promise<EmailVerificationResult> {
  const url = new URL("https://emailreputation.abstractapi.com/v1/");
  url.searchParams.set("email", email);

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(6_000),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    console.error("Email Reputation API error", response.status);
    return { ok: true };
  }

  const data = (await response.json()) as AbstractReputationResponse;

  if (
    data.suggested_correction &&
    data.suggested_correction.toLowerCase() !== email.toLowerCase()
  ) {
    const suggested = data.suggested_correction;
    return fail(
      `Please check your email. Did you mean ${suggested}?`,
      suggested
    );
  }

  if (data.email_quality?.is_disposable) {
    return fail(EMAIL_ERRORS.disposable);
  }

  if (data.email_deliverability?.status === "undeliverable") {
    return fail(EMAIL_ERRORS.undeliverable);
  }

  return { ok: true };
}

export async function verifyContactEmail(
  email: string
): Promise<EmailVerificationResult> {
  const suggestion = suggestEmailCorrection(email);
  if (suggestion) {
    return fail(`Please check your email. Did you mean ${suggestion}?`, suggestion);
  }

  const domain = getEmailDomain(email);
  if (!domain) {
    return fail(EMAIL_ERRORS.invalid);
  }

  if (isDisposableEmailDomain(domain)) {
    return fail(EMAIL_ERRORS.disposable);
  }

  const acceptsMail = await domainAcceptsMail(domain);
  if (!acceptsMail) {
    return fail(EMAIL_ERRORS.domain);
  }

  const apiKey =
    process.env.ABSTRACT_EMAIL_API_KEY ??
    process.env.EMAIL_VERIFICATION_API_KEY;

  if (apiKey) {
    try {
      return await verifyWithAbstractApi(email, apiKey);
    } catch (error) {
      console.error("Email verification API failed", error);
      return { ok: true };
    }
  }

  return { ok: true };
}
