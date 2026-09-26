import Link from "next/link";
import { notFound } from "next/navigation";
import NewsForm from "@/components/admin/NewsForm";
import { getDocument } from "@/lib/content/repository";

export default async function NewsEditPage({ params }: { params: { id: string } }) {
  const doc = await getDocument();
  const post =
    params.id === "new" ? null : (doc.news.find((item) => item.id === params.id) ?? undefined);
  if (post === undefined) notFound();

  return (
    <div>
      <Link href="/admin/news" className="text-sm font-semibold text-kld-navy">
        ← 소식 목록
      </Link>
      <h1 className="mb-6 mt-3 text-3xl font-black">{post ? "소식 수정" : "새 소식"}</h1>
      <NewsForm initial={post} />
    </div>
  );
}
