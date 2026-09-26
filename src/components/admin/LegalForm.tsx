"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SaveNote from "@/components/admin/SaveNote";
import { saveLegal } from "@/lib/content/actions";
import type { ActionResult, LegalDoc } from "@/lib/content/types";

export default function LegalForm({
  privacy,
  terms,
}: {
  privacy: LegalDoc;
  terms: LegalDoc;
}) {
  const router = useRouter();
  const [docs, setDocs] = useState({ privacy, terms });
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const next = await saveLegal(docs);
    setResult(next);
    setPending(false);
    if (next.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {(["privacy", "terms"] as const).map((key) => (
        <section key={key} className="kld-card space-y-3 p-6">
          <h2 className="text-lg font-black">{key === "privacy" ? "개인정보처리방침" : "이용약관"}</h2>
          <label className="block">
            <span className="kld-label">제목</span>
            <input
              className="kld-input"
              value={docs[key].title}
              onChange={(e) => setDocs({ ...docs, [key]: { ...docs[key], title: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className="kld-label">본문</span>
            <textarea
              className="kld-input"
              rows={12}
              value={docs[key].body}
              onChange={(e) => setDocs({ ...docs, [key]: { ...docs[key], body: e.target.value } })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={docs[key].isDraft}
              onChange={(e) => setDocs({ ...docs, [key]: { ...docs[key], isDraft: e.target.checked } })}
            />
            임시 초안 표시
          </label>
        </section>
      ))}
      <SaveNote result={result} />
      <button type="submit" className="kld-btn-navy" disabled={pending}>
        {pending ? "저장 중…" : "문서 저장"}
      </button>
    </form>
  );
}
