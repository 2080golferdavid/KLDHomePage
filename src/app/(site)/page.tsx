import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/components/site/CmsImage";
import HeroMark from "@/components/site/HeroMark";
import { getDocument } from "@/lib/content/repository";
import { formatKoDate, publishedNews } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getDocument();
  return {
    title: { absolute: `${doc.settings.siteName} · ${doc.settings.siteNameEn}` },
    description: doc.settings.oneLiner,
  };
}

export default async function HomePage() {
  const doc = await getDocument();
  const { settings, about } = doc;
  const news = publishedNews(doc.news).slice(0, 3);
  const lines = settings.heroTitle.split("\n");

  return (
    <main>
      <section className="kld-shell pt-6">
        <div className="grid overflow-hidden rounded-[32px] bg-kld-navy text-white md:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-white/60">{settings.heroEyebrow}</p>
            <h1 className="mt-4 text-4xl font-black leading-[1.2] tracking-tight sm:text-6xl">
              {lines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium text-white/85">{settings.oneLiner}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">{settings.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="kld-btn-red">
                협회 소개 보기
              </Link>
              <Link href="/news" className="kld-btn-ghost">
                최신 소식
              </Link>
            </div>
          </div>
          {settings.heroImageUrl ? (
            <div className="relative min-h-[240px]">
              <CmsImage
                src={`/api/brand/hero?v=${encodeURIComponent(settings.updatedAt)}`}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <HeroMark />
          )}
        </div>
      </section>

      <section className="kld-shell grid gap-4 py-8 md:grid-cols-3">
        {about.values.slice(0, 3).map((value) => (
          <Link key={value.number} href="/about#values" className="kld-card block p-6 transition hover:-translate-y-0.5">
            <p className="text-xs font-semibold tracking-[0.16em] text-kld-muted">{value.number}</p>
            <h2 className="mt-3 text-2xl font-black">{value.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-kld-muted">{value.body}</p>
          </Link>
        ))}
      </section>

      <section className="kld-shell pb-4">
        <div className="kld-card p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-kld-red">NEWS</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">협회 소식</h2>
            </div>
            <Link href="/news" className="text-sm font-semibold text-kld-navy">
              전체 보기 →
            </Link>
          </div>
          <ul className="mt-6 divide-y divide-kld-line">
            {news.length === 0 && <li className="py-6 text-sm text-kld-muted">아직 공개된 소식이 없습니다.</li>}
            {news.map((post) => (
              <li key={post.id}>
                <Link href={`/news/${post.slug}`} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:justify-between">
                  <span>
                    <span className="mr-2 text-xs font-semibold text-kld-navy">{post.category}</span>
                    <span className="text-base font-bold">{post.title}</span>
                    <span className="mt-1 block text-sm text-kld-muted">{post.excerpt}</span>
                  </span>
                  <time className="shrink-0 text-sm text-kld-muted" dateTime={post.publishedAt}>
                    {formatKoDate(post.publishedAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kld-shell py-8 pb-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[32px] bg-kld-navy px-6 py-10 text-white sm:flex-row sm:items-center sm:px-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-black sm:text-3xl">먼저 이야기로 만나 주세요.</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              대회 신청, 회원 가입, 결제 기능은 아직 열리지 않았습니다. 소식과 문의로 협회를 천천히 알아봐 주세요.
            </p>
          </div>
          <Link href="/contact" className="kld-btn-red">
            문의하기
          </Link>
        </div>
      </section>
    </main>
  );
}
