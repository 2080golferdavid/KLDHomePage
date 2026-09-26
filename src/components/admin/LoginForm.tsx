"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAdmin } from "@/lib/content/actions";
import type { ActionResult } from "@/lib/content/types";

const initial: ActionResult = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="kld-btn-navy w-full" disabled={pending}>
      {pending ? "확인 중…" : "들어가기"}
    </button>
  );
}

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action] = useFormState(loginAdmin, initial);

  return (
    <form action={action} className="kld-card w-full max-w-md p-8">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-kld-muted">KLD ADMIN</p>
      <h1 className="mt-2 text-3xl font-black">관리자 로그인</h1>
      <p className="mt-3 text-sm leading-relaxed text-kld-muted">
        이 주소는 공개 메뉴와 바닥글에 없습니다. 비밀번호는 환경 변수로만 바꿉니다.
      </p>
      {!configured && (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          아직 비밀번호가 없습니다. <code>.env.local</code> 에 <code>ADMIN_PASSWORD</code> 와{" "}
          <code>ADMIN_SESSION_SECRET</code> 을 넣고 서버를 다시 실행해 주세요.
        </p>
      )}
      <label className="kld-label mt-6" htmlFor="password">
        비밀번호
      </label>
      <input id="password" name="password" type="password" autoComplete="current-password" className="kld-input" required />
      {state.message && <p className="mt-3 text-sm text-kld-red">{state.message}</p>}
      <div className="mt-6">
        <Submit />
      </div>
    </form>
  );
}
