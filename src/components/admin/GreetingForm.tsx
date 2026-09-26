"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaField from "@/components/admin/MediaField";
import SaveNote from "@/components/admin/SaveNote";
import { saveGreeting } from "@/lib/content/actions";
import type { ActionResult, GreetingContent } from "@/lib/content/types";

export default function GreetingForm({ initial }: { initial: GreetingContent }) {
  const router = useRouter();
  const [greeting, setGreeting] = useState(initial);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const next = await saveGreeting(greeting);
    setResult(next);
    setPending(false);
    if (next.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="kld-card space-y-4 p-6">
        <p className="text-sm leading-relaxed text-kld-muted">
          확인된 내용만 적습니다. 이름, 직함, 사진, 본문은 비워 두어도 됩니다.
        </p>
        <label className="block">
          <span className="kld-label">제목</span>
          <input
            className="kld-input"
            value={greeting.title}
            onChange={(event) => setGreeting({ ...greeting, title: event.target.value })}
          />
        </label>
        <label className="block">
          <span className="kld-label">본문</span>
          <textarea
            className="kld-input"
            rows={10}
            value={greeting.body}
            placeholder="빈 줄로 문단을 나눕니다."
            onChange={(event) => setGreeting({ ...greeting, body: event.target.value })}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="kld-label">이름</span>
            <input
              className="kld-input"
              value={greeting.name}
              onChange={(event) => setGreeting({ ...greeting, name: event.target.value })}
            />
          </label>
          <label className="block">
            <span className="kld-label">직함</span>
            <input
              className="kld-input"
              value={greeting.role}
              onChange={(event) => setGreeting({ ...greeting, role: event.target.value })}
            />
          </label>
        </div>
        <MediaField
          label="사진"
          hint="선택입니다. 로고처럼 자르지 않고 올린 그림 그대로 저장합니다."
          emptyLabel="사진 없음"
          value={greeting.photoUrl}
          onChange={(photoUrl) => setGreeting({ ...greeting, photoUrl })}
        />
      </section>
      <SaveNote result={result} />
      <button type="submit" className="kld-btn-navy" disabled={pending}>
        {pending ? "저장 중…" : "인사말 저장"}
      </button>
    </form>
  );
}
