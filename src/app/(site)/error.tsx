"use client";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="kld-shell py-20">
      <h1 className="text-3xl font-black">화면을 불러오지 못했습니다.</h1>
      <p className="mt-3 text-sm text-kld-muted">잠시 뒤에 다시 시도해 주세요.</p>
      <button type="button" className="kld-btn-navy mt-6" onClick={() => reset()}>
        다시 시도
      </button>
    </main>
  );
}
