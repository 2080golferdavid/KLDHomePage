import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Prose from "@/components/site/Prose";
import { getDocument } from "@/lib/content/repository";
import { formatKoDate, publishedNews } from "@/lib/format";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const doc = await getDocument();
  const post = publishedNews(doc.news).find((item) => item.slug === params.slug);
  if (!post) return { title: "소식을 찾을 수 없습니다" };
  return { title: post.title, description: post.excerpt };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const doc = await getDocument();
  const posts = publishedNews(doc.news);
  const post = posts.find((item) => item.slug === params.slug);
  if (!post) notFound();
  const others = posts.filter((item) => item.id !== post.id).slice(0, 3);

  return (
    <main className="kld-shell py-10 pb-16">
      <Link href="/news" className="text-sm font-semibold text-kld-navy">
        ← 협회 소식
      </Link>
      <article className="kld-card mt-4 p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-kld-muted">
          <span className="font-semibold text-kld-navy">{post.category}</span>
          {post.isExample && <span className="kld-chip">예시</span>}
          <time dateTime={post.publishedAt}>{formatKoDate(post.publishedAt)}</time>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{post.title}</h1>
        {post.excerpt && <p className="mt-4 text-base leading-relaxed text-kld-muted">{post.excerpt}</p>}
        <div className="mt-8">
          <Prose text={post.body} />
        </div>
      </article>

      {others.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-black">다른 소식</h2>
          <ul className="mt-3 space-y-2">
            {others.map((item) => (
              <li key={item.id}>
                <Link href={`/news/${item.slug}`} className="text-sm font-semibold text-kld-navy hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
