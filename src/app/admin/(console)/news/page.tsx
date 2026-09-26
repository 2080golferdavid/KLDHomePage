import Link from "next/link";
import { getDocument } from "@/lib/content/repository";
import { formatKoDate } from "@/lib/format";

export default async function NewsAdminPage() {
  const doc = await getDocument();
  const posts = doc.news.slice().sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">협회 소식</h1>
          <p className="mt-2 text-sm text-kld-muted">공개를 끄면 사이트에서 숨습니다.</p>
        </div>
        <Link href="/admin/news/new" className="kld-btn-navy">
          + 소식 추가
        </Link>
      </div>
      <ul className="kld-card mt-6 divide-y divide-kld-line px-2">
        {posts.length === 0 && <li className="p-6 text-sm text-kld-muted">소식이 없습니다.</li>}
        {posts.map((post) => (
          <li key={post.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold">{post.title}</p>
              <p className="text-xs text-kld-muted">
                {formatKoDate(post.publishedAt)} · {post.published ? "공개" : "숨김"}
                {post.isExample ? " · 예시" : ""}
              </p>
            </div>
            <Link href={`/admin/news/${post.id}`} className="text-sm font-semibold text-kld-navy">
              수정
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
