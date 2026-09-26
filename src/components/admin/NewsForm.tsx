"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SaveNote from "@/components/admin/SaveNote";
import { deleteNewsPost, saveNewsPost } from "@/lib/content/actions";
import type { ActionResult, NewsPost } from "@/lib/content/types";

function toLocalInput(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createDraft(): NewsPost {
  return {
    id: crypto.randomUUID(),
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    category: "안내",
    publishedAt: new Date().toISOString(),
    published: true,
    isExample: false,
  };
}

export default function NewsForm({ initial }: { initial: NewsPost | null }) {
  const router = useRouter();
  const [post, setPost] = useState<NewsPost>(initial ?? createDraft());
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  function set<K extends keyof NewsPost>(key: K, value: NewsPost[K]) {
    setPost((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const next = await saveNewsPost(post);
    setResult(next);
    setPending(false);
    if (next.ok) {
      router.replace(`/admin/news/${post.id}`);
      router.refresh();
    }
  }

  return (
    <>
    <form onSubmit={onSubmit} className="kld-card space-y-4 p-6">
      <label className="block">
        <span className="kld-label">제목</span>
        <input className="kld-input" value={post.title} onChange={(e) => set("title", e.target.value)} required />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="kld-label">주소 이름 (영문)</span>
          <input className="kld-input" value={post.slug} placeholder="비우면 자동으로 만듭니다" onChange={(e) => set("slug", e.target.value)} />
        </label>
        <label className="block">
          <span className="kld-label">분류</span>
          <input className="kld-input" value={post.category} onChange={(e) => set("category", e.target.value)} />
        </label>
      </div>
      <label className="block">
        <span className="kld-label">날짜</span>
        <input
          className="kld-input"
          type="datetime-local"
          value={toLocalInput(post.publishedAt)}
          onChange={(e) => {
            const parsed = new Date(e.target.value);
            if (!Number.isNaN(parsed.getTime())) set("publishedAt", parsed.toISOString());
          }}
        />
      </label>
      <label className="block">
        <span className="kld-label">짧은 요약</span>
        <textarea className="kld-input" rows={2} value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </label>
      <label className="block">
        <span className="kld-label">본문</span>
        <textarea className="kld-input" rows={12} value={post.body} onChange={(e) => set("body", e.target.value)} />
        <span className="mt-1 block text-xs text-kld-muted">빈 줄은 문단을 나눕니다.</span>
      </label>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={post.published} onChange={(e) => set("published", e.target.checked)} />
          공개
        </label>
      </div>
      <SaveNote result={result} />
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="kld-btn-navy" disabled={pending}>
          {pending ? "저장 중…" : "소식 저장"}
        </button>
        {initial && (
          <button type="submit" form="delete-news" className="kld-btn-line text-kld-red">
            삭제
          </button>
        )}
      </div>
    </form>
    {initial && (
      <form
        id="delete-news"
        action={deleteNewsPost.bind(null, post.id)}
        onSubmit={(event) => {
          if (!window.confirm("이 소식을 삭제할까요?")) event.preventDefault();
        }}
      />
    )}
    </>
  );
}
