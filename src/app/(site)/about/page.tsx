import type { Metadata } from "next";
import Link from "next/link";
import { getDocument } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "KLD 소개",
  description: "한국장타협회의 마음가짐, 가치, 걸어온 길을 소개합니다.",
};

export default async function AboutPage() {
  const doc = await getDocument();
  const { about } = doc;
  const lines = about.title.split("\n");

  return (
    <main className="kld-shell space-y-6 py-6 pb-16">
      <section className="rounded-[32px] bg-kld-navy px-6 py-14 text-white sm:px-12 sm:py-16">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-white/60">{about.eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.2] tracking-tight sm:text-6xl">
          {lines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{about.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/officials" className="kld-btn-red">
            임원 만나보기
          </Link>
          <Link href="/contact" className="kld-btn-ghost">
            협회에 문의
          </Link>
        </div>
      </section>

      <section className="kld-card p-6 sm:p-10">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-kld-red">MISSION</p>
        <h2 className="mt-2 text-3xl font-black">{about.missionTitle}</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-kld-muted">{about.missionBody}</p>
      </section>

      <section id="values" className="grid gap-4 md:grid-cols-3">
        {about.values.map((value) => (
          <article key={value.number} className="kld-card p-6">
            <p className="text-sm font-semibold text-kld-muted">{value.number}</p>
            <h2 className="mt-4 text-2xl font-black">{value.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-kld-muted">{value.body}</p>
          </article>
        ))}
      </section>

      {about.history.length > 0 && (
        <section className="kld-card p-6 sm:p-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-kld-red">HISTORY</p>
          <h2 className="mt-2 text-3xl font-black">걸어온 길</h2>
          <ol className="mt-8 space-y-6">
            {about.history.map((item) => (
              <li key={`${item.year}-${item.title}`} className="grid gap-2 border-t border-kld-line pt-6 sm:grid-cols-[100px_1fr]">
                <p className="text-lg font-black text-kld-navy">{item.year}</p>
                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-kld-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
