"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SaveNote from "@/components/admin/SaveNote";
import { saveAbout } from "@/lib/content/actions";
import type { AboutContent, ActionResult } from "@/lib/content/types";

export default function AboutForm({ initial }: { initial: AboutContent }) {
  const router = useRouter();
  const [about, setAbout] = useState(initial);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const next = await saveAbout(about);
    setResult(next);
    setPending(false);
    if (next.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="kld-card space-y-4 p-6">
        <label className="block">
          <span className="kld-label">작은 영문 라벨</span>
          <input className="kld-input" value={about.eyebrow} onChange={(e) => setAbout({ ...about, eyebrow: e.target.value })} />
        </label>
        <label className="block">
          <span className="kld-label">큰 제목</span>
          <textarea className="kld-input" rows={3} value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} />
        </label>
        <label className="block">
          <span className="kld-label">소개 문단</span>
          <textarea className="kld-input" rows={4} value={about.intro} onChange={(e) => setAbout({ ...about, intro: e.target.value })} />
        </label>
        <label className="block">
          <span className="kld-label">미션 제목</span>
          <input className="kld-input" value={about.missionTitle} onChange={(e) => setAbout({ ...about, missionTitle: e.target.value })} />
        </label>
        <label className="block">
          <span className="kld-label">미션 본문</span>
          <textarea className="kld-input" rows={4} value={about.missionBody} onChange={(e) => setAbout({ ...about, missionBody: e.target.value })} />
        </label>
      </section>

      <section className="kld-card space-y-4 p-6">
        <h2 className="text-lg font-black">가치</h2>
        {about.values.map((value, index) => (
          <div key={index} className="grid gap-2 rounded-2xl bg-kld-paper p-3 sm:grid-cols-[72px_1fr]">
            <input
              className="kld-input"
              value={value.number}
              onChange={(e) => {
                const values = about.values.slice();
                values[index] = { ...value, number: e.target.value };
                setAbout({ ...about, values });
              }}
            />
            <div className="space-y-2">
              <input
                className="kld-input"
                value={value.title}
                placeholder="제목"
                onChange={(e) => {
                  const values = about.values.slice();
                  values[index] = { ...value, title: e.target.value };
                  setAbout({ ...about, values });
                }}
              />
              <textarea
                className="kld-input"
                rows={2}
                value={value.body}
                onChange={(e) => {
                  const values = about.values.slice();
                  values[index] = { ...value, body: e.target.value };
                  setAbout({ ...about, values });
                }}
              />
              <button
                type="button"
                className="text-sm font-semibold text-kld-red"
                onClick={() => setAbout({ ...about, values: about.values.filter((_, item) => item !== index) })}
              >
                이 가치 삭제
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="kld-btn-line"
          onClick={() =>
            setAbout({
              ...about,
              values: [...about.values, { number: String(about.values.length + 1).padStart(2, "0"), title: "", body: "" }],
            })
          }
        >
          가치 추가
        </button>
      </section>

      <section className="kld-card space-y-4 p-6">
        <h2 className="text-lg font-black">연혁</h2>
        {about.history.map((item, index) => (
          <div key={index} className="space-y-2 rounded-2xl bg-kld-paper p-3">
            <div className="grid gap-2 sm:grid-cols-[100px_1fr]">
              <input
                className="kld-input"
                value={item.year}
                placeholder="연도"
                onChange={(e) => {
                  const history = about.history.slice();
                  history[index] = { ...item, year: e.target.value };
                  setAbout({ ...about, history });
                }}
              />
              <input
                className="kld-input"
                value={item.title}
                placeholder="제목"
                onChange={(e) => {
                  const history = about.history.slice();
                  history[index] = { ...item, title: e.target.value };
                  setAbout({ ...about, history });
                }}
              />
            </div>
            <textarea
              className="kld-input"
              rows={2}
              value={item.body}
              onChange={(e) => {
                const history = about.history.slice();
                history[index] = { ...item, body: e.target.value };
                setAbout({ ...about, history });
              }}
            />
            <button
              type="button"
              className="text-sm font-semibold text-kld-red"
              onClick={() => setAbout({ ...about, history: about.history.filter((_, itemIndex) => itemIndex !== index) })}
            >
              이 연혁 삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          className="kld-btn-line"
          onClick={() =>
            setAbout({
              ...about,
              history: [...about.history, { year: "", title: "", body: "", isExample: false }],
            })
          }
        >
          연혁 추가
        </button>
      </section>

      <SaveNote result={result} />
      <button type="submit" className="kld-btn-navy" disabled={pending}>
        {pending ? "저장 중…" : "소개 저장"}
      </button>
    </form>
  );
}
