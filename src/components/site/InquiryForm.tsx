"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitInquiry } from "@/lib/content/actions";
import type { ActionResult } from "@/lib/content/types";

const initial: ActionResult = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="kld-btn-red" disabled={pending}>
      {pending ? "보내는 중…" : "문의 보내기"}
    </button>
  );
}

export default function InquiryForm({ email }: { email: string }) {
  const [state, action] = useFormState(submitInquiry, initial);
  const mailto = `mailto:${email}?subject=${encodeURIComponent("한국장타협회 문의")}`;

  return (
    <form action={action} className="space-y-4">
      <div className="hidden" aria-hidden="true">
        <label>
          회사
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div>
        <label className="kld-label" htmlFor="name">
          이름
        </label>
        <input id="name" name="name" required maxLength={80} className="kld-input" placeholder="홍길동" />
      </div>
      <div>
        <label className="kld-label" htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={120}
          className="kld-input"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="kld-label" htmlFor="message">
          문의 내용
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          maxLength={4000}
          rows={6}
          className="kld-input"
          placeholder="협회에 묻고 싶은 내용을 적어 주세요."
        />
      </div>
      {state.message && (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 text-sm ${
            state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-kld-red"
          }`}
        >
          {state.message}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton />
        <a href={mailto} className="text-sm font-semibold text-kld-navy underline">
          메일로 직접 보내기
        </a>
      </div>
    </form>
  );
}
