export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm font-mono animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
