import type { Metadata } from "next";
import Link from "next/link";
import { getDocument } from "@/lib/content/repository";
import { formatKoDate, publishedNews } from "@/lib/format";

export const metadata: Metadata = {
  title: "협회 소식",
  description: "한국장타협회의 안내와 새 소식입니다.",
};

export default async function NewsPage() {
  const doc = await getDocument();
  const posts = publishedNews(doc.news);

  return (
    <main className="kld-shell py-10 pb-16">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-kld-red">ASSOCIATION NEWS</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">협회 소식</h1>
      <p className="mt-4 max-w-2xl text-base text-kld-muted">협회의 안내와 새 소식을 모았습니다. 예시라고 적힌 글은 임시입니다.</p>

      <div className="kld-card mt-8 p-2 sm:p-4">
        {posts.length === 0 ? (
          <p className="p-6 text-sm text-kld-muted">아직 공개된 소식이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-kld-line">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/news/${post.slug}`} className="block rounded-2xl px-4 py-5 hover:bg-kld-paper">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-kld-muted">
                    <span className="font-semibold text-kld-navy">{post.category}</span>
                    {post.isExample && <span className="kld-chip">예시</span>}
                    <time dateTime={post.publishedAt}>{formatKoDate(post.publishedAt)}</time>
                  </div>
                  <h2 className="mt-2 text-xl font-bold">{post.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-kld-muted">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
