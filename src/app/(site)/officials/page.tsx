import type { Metadata } from "next";
import CmsImage from "@/components/site/CmsImage";
import { getDocument } from "@/lib/content/repository";
import { publishedOfficials } from "@/lib/format";

export const metadata: Metadata = {
  title: "임원진",
  description: "한국장타협회를 함께 만드는 사람들입니다.",
};

export default async function OfficialsPage() {
  const doc = await getDocument();
  const people = publishedOfficials(doc.officials);

  return (
    <main className="kld-shell py-10 pb-16">
      <p className="text-[11px] font-semibold tracking-[0.2em] text-kld-navy-2">THE PEOPLE OF KLD</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">KLD를 함께 만드는 사람들.</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-kld-muted">
        한국장타협회의 운영과 성장을 함께하는 임원진을 소개합니다.
      </p>
      <p className="mt-2 text-sm text-kld-muted">이름, 역할, 사진은 확정 전 예시일 수 있습니다. 카드의 예시 표시를 확인해 주세요.</p>

      {people.length === 0 ? (
        <p className="kld-card mt-8 p-8 text-sm text-kld-muted">아직 공개된 임원이 없습니다.</p>
      ) : (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
            <li key={person.id} className="overflow-hidden rounded-[28px] bg-white shadow-card">
              <div className="relative flex h-64 items-center justify-center bg-gradient-to-b from-[#E7EEF6] to-[#F7F8FB]">
                {person.isExample && <span className="kld-chip absolute left-4 top-4 bg-white">예시 프로필</span>}
                {person.photoUrl ? (
                  <CmsImage src={person.photoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-7xl font-black text-[#243044]/80">{person.name.slice(0, 1)}</span>
                )}
                <span className="absolute bottom-4 left-5 text-[11px] font-semibold tracking-[0.2em] text-slate-400">
                  KLD PROFILE
                </span>
                <span className="pointer-events-none absolute bottom-2 right-4 text-3xl font-black text-slate-300/90">
                  KLD
                </span>
              </div>
              <div className="px-5 py-5">
                <p className="text-sm font-semibold text-[#1D4E89]">{person.role}</p>
                <h2 className="mt-1 text-2xl font-black">{person.name}</h2>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-kld-muted">{person.nameEn}</p>
                {person.bio && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-kld-muted">{person.bio}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-xs text-kld-muted">선수 소개는 다음 단계에서 열립니다. 이번 페이지는 임원만 보여 줍니다.</p>
    </main>
  );
}
