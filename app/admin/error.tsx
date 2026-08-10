"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <p className="font-mono text-sm text-red-300">Admin error</p>
      <h1 className="mt-3 text-2xl font-bold">The action could not complete</h1>
      <p className="mt-3 text-sm text-text-secondary">
        {error.message || "Please verify the content and try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background"
      >
        Try again
      </button>
    </div>
  );
}
