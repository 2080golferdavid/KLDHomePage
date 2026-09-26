"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SaveNote from "@/components/admin/SaveNote";
import { saveContact } from "@/lib/content/actions";
import type { ActionResult, ContactSettings } from "@/lib/content/types";

export default function ContactForm({ initial }: { initial: ContactSettings }) {
  const router = useRouter();
  const [contact, setContact] = useState(initial);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const next = await saveContact(contact);
    setResult(next);
    setPending(false);
    if (next.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="kld-card space-y-4 p-6">
      <label className="block">
        <span className="kld-label">이메일</span>
        <input className="kld-input" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
      </label>
      <label className="block">
        <span className="kld-label">전화</span>
        <input className="kld-input" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
      </label>
      <label className="block">
        <span className="kld-label">주소</span>
        <input className="kld-input" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
      </label>
      <label className="block">
        <span className="kld-label">시간</span>
        <input className="kld-input" value={contact.hours} onChange={(e) => setContact({ ...contact, hours: e.target.value })} />
      </label>
      <label className="block">
        <span className="kld-label">안내 문장</span>
        <textarea className="kld-input" rows={3} value={contact.note} onChange={(e) => setContact({ ...contact, note: e.target.value })} />
      </label>
      <SaveNote result={result} />
      <button type="submit" className="kld-btn-navy" disabled={pending}>
        {pending ? "저장 중…" : "연락처 저장"}
      </button>
    </form>
  );
}
