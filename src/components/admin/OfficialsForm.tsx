"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaField from "@/components/admin/MediaField";
import SaveNote from "@/components/admin/SaveNote";
import { saveOfficials } from "@/lib/content/actions";
import type { ActionResult, Official } from "@/lib/content/types";

function blank(sort: number): Official {
  return {
    id: crypto.randomUUID(),
    name: "",
    nameEn: "",
    role: "",
    bio: "",
    photoUrl: "",
    sort,
    published: true,
    isExample: true,
  };
}

export default function OfficialsForm({ initial }: { initial: Official[] }) {
  const router = useRouter();
  const [people, setPeople] = useState(initial);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  function update(index: number, patch: Partial<Official>) {
    setPeople((current) => current.map((person, item) => (item === index ? { ...person, ...patch } : person)));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const next = await saveOfficials(people);
    setResult(next);
    setPending(false);
    if (next.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {people.map((person, index) => (
        <section key={person.id} className="kld-card space-y-3 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="kld-label">이름</span>
              <input className="kld-input" value={person.name} onChange={(e) => update(index, { name: e.target.value })} />
            </label>
            <label className="block">
              <span className="kld-label">영문 이름</span>
              <input className="kld-input" value={person.nameEn} onChange={(e) => update(index, { nameEn: e.target.value })} />
            </label>
            <label className="block">
              <span className="kld-label">역할</span>
              <input className="kld-input" value={person.role} onChange={(e) => update(index, { role: e.target.value })} />
            </label>
            <label className="block">
              <span className="kld-label">순서</span>
              <input
                className="kld-input"
                type="number"
                value={person.sort}
                onChange={(e) => update(index, { sort: Number(e.target.value) })}
              />
            </label>
          </div>
          <label className="block">
            <span className="kld-label">짧은 소개</span>
            <textarea className="kld-input" rows={3} value={person.bio} onChange={(e) => update(index, { bio: e.target.value })} />
          </label>
          <MediaField
            label="사진"
            emptyLabel="글자 카드"
            value={person.photoUrl}
            onChange={(photoUrl) => update(index, { photoUrl })}
          />
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={person.published} onChange={(e) => update(index, { published: e.target.checked })} />
              공개
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={person.isExample} onChange={(e) => update(index, { isExample: e.target.checked })} />
              예시 표시
            </label>
            <button type="button" className="font-semibold text-kld-red" onClick={() => setPeople(people.filter((item) => item.id !== person.id))}>
              이 임원 삭제
            </button>
          </div>
        </section>
      ))}
      <button type="button" className="kld-btn-line" onClick={() => setPeople([...people, blank(people.length + 1)])}>
        임원 추가
      </button>
      <SaveNote result={result} />
      <button type="submit" className="kld-btn-navy" disabled={pending}>
        {pending ? "저장 중…" : "임원 저장"}
      </button>
    </form>
  );
}
