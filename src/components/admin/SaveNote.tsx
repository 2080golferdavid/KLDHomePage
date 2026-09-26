import type { ActionResult } from "@/lib/content/types";

export default function SaveNote({ result }: { result: ActionResult | null }) {
  if (!result?.message) return null;
  return (
    <p
      role="status"
      className={`rounded-2xl px-4 py-3 text-sm ${
        result.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-kld-red"
      }`}
    >
      {result.message}
    </p>
  );
}
