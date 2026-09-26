"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaField from "@/components/admin/MediaField";
import SaveNote from "@/components/admin/SaveNote";
import { saveSettings } from "@/lib/content/actions";
import type { ActionResult, SiteSettings } from "@/lib/content/types";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const next = await saveSettings(settings);
    setResult(next);
    setPending(false);
    if (next.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="kld-card space-y-4 p-6">
        <h2 className="text-lg font-black">이름과 한 줄</h2>
        <label className="block">
          <span className="kld-label">협회 이름</span>
          <input className="kld-input" value={settings.siteName} onChange={(e) => set("siteName", e.target.value)} />
        </label>
        <label className="block">
          <span className="kld-label">영문 이름</span>
          <input className="kld-input" value={settings.siteNameEn} onChange={(e) => set("siteNameEn", e.target.value)} />
        </label>
        <label className="block">
          <span className="kld-label">슬로건</span>
          <input className="kld-input" value={settings.slogan} onChange={(e) => set("slogan", e.target.value)} />
        </label>
        <label className="block">
          <span className="kld-label">한 줄 소개</span>
          <textarea className="kld-input" rows={2} value={settings.oneLiner} onChange={(e) => set("oneLiner", e.target.value)} />
        </label>
      </section>

      <section className="kld-card space-y-4 p-6">
        <h2 className="text-lg font-black">로고와 파비콘</h2>
        <p className="text-sm text-kld-muted">비워 두면 기본 KLD 로고를 씁니다. 파일을 올리면 그 그림으로 바뀝니다.</p>
        <MediaField
          label="로고"
          emptyLabel="기본 로고"
          value={settings.logoUrl}
          onChange={(logoUrl) => set("logoUrl", logoUrl)}
        />
        <MediaField
          label="파비콘"
          hint="브라우저 탭의 작은 아이콘입니다."
          emptyLabel="기본 아이콘"
          value={settings.faviconUrl}
          onChange={(faviconUrl) => set("faviconUrl", faviconUrl)}
        />
      </section>

      <section className="kld-card space-y-4 p-6">
        <h2 className="text-lg font-black">첫 화면</h2>
        <label className="block">
          <span className="kld-label">작은 영문 라벨</span>
          <input className="kld-input" value={settings.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
        </label>
        <label className="block">
          <span className="kld-label">큰 제목</span>
          <textarea className="kld-input" rows={3} value={settings.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
          <span className="mt-1 block text-xs text-kld-muted">줄을 바꾸면 제목도 다음 줄로 내려갑니다.</span>
        </label>
        <label className="block">
          <span className="kld-label">설명</span>
          <textarea className="kld-input" rows={4} value={settings.heroBody} onChange={(e) => set("heroBody", e.target.value)} />
        </label>
        <MediaField
          label="히어로 그림"
          hint="비우면 단순한 그래픽을 보여 줍니다. 사람 사진을 넣을 수도 있습니다."
          emptyLabel="기본 그래픽"
          value={settings.heroImageUrl}
          onChange={(heroImageUrl) => set("heroImageUrl", heroImageUrl)}
        />
      </section>

      <section className="kld-card space-y-4 p-6">
        <h2 className="text-lg font-black">바닥글과 SNS</h2>
        <label className="block">
          <span className="kld-label">바닥글 짧은 설명</span>
          <textarea className="kld-input" rows={2} value={settings.footerNote} onChange={(e) => set("footerNote", e.target.value)} />
        </label>
        <div className="space-y-3">
          {settings.sns.map((link, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
              <input
                className="kld-input"
                value={link.label}
                placeholder="이름"
                onChange={(e) => {
                  const sns = settings.sns.slice();
                  sns[index] = { ...link, label: e.target.value };
                  set("sns", sns);
                }}
              />
              <input
                className="kld-input"
                value={link.href}
                placeholder="https://"
                onChange={(e) => {
                  const sns = settings.sns.slice();
                  sns[index] = { ...link, href: e.target.value };
                  set("sns", sns);
                }}
              />
              <button
                type="button"
                className="kld-btn-line"
                onClick={() => set("sns", settings.sns.filter((_, item) => item !== index))}
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            className="kld-btn-line"
            onClick={() => set("sns", [...settings.sns, { label: "", href: "https://" }])}
          >
            SNS 추가
          </button>
        </div>
      </section>

      <SaveNote result={result} />
      <button type="submit" className="kld-btn-navy" disabled={pending}>
        {pending ? "저장 중…" : "설정 저장"}
      </button>
    </form>
  );
}
