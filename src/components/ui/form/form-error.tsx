export function FormError({
  message,
  variant = "light",
}: {
  message: string | null | undefined;
  variant?: "dark" | "light";
}) {
  if (!message) return null;

  if (variant === "dark") {
    return (
      <div
        className="flex items-start gap-2 p-3 text-xs text-red-400 bg-red-500/10 border
          border-red-500/20 rounded-xl"
      >
        <span className="shrink-0">⚠</span>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-2.5 p-4 text-sm text-red-700 bg-red-50 border border-red-100
        rounded-xl"
    >
      <span className="mt-0.5 shrink-0">⚠</span>
      <span>{message}</span>
    </div>
  );
}
