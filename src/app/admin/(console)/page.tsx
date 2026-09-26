import Link from "next/link";
import { getContentStatus, getDocument, pingStore } from "@/lib/content/repository";
import { publishedNews, publishedOfficials } from "@/lib/format";

const MODE_LABEL = {
  file: "이 컴퓨터 파일",
  supabase: "Supabase",
  seed: "예시만, 읽기 전용",
} as const;

export default async function AdminHomePage() {
  const doc = await getDocument();
  const status = getContentStatus();
  const problem = await pingStore();
  const cards = [
    { label: "공개 소식", value: String(publishedNews(doc.news).length), href: "/admin/news" },
    { label: "공개 임원", value: String(publishedOfficials(doc.officials).length), href: "/admin/officials" },
    { label: "받은 문의", value: String(doc.inquiries.length), href: "/admin/inquiries" },
    { label: "저장 방식", value: MODE_LABEL[status.mode], href: "/admin/settings" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black">운영 대시보드</h1>
      <p className="mt-2 text-sm text-kld-muted">로고, 소개, 임원, 소식, 연락처를 코드 없이 고칩니다.</p>
      <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${problem ? "bg-red-50 text-kld-red" : "bg-white text-kld-muted shadow-card"}`}>
        {problem ? `저장소를 확인하지 못했습니다. ${problem}` : status.detail}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="kld-card block p-5">
            <p className="text-sm text-kld-muted">{card.label}</p>
            <p className="mt-2 text-2xl font-black text-kld-navy">{card.value}</p>
          </Link>
        ))}
      </div>
      <section className="kld-card mt-6 p-6">
        <h2 className="text-lg font-black">빠른 작업</h2>
        <ul className="mt-4 divide-y divide-kld-line text-sm font-semibold">
          <li className="py-3">
            <Link href="/admin/settings">로고와 첫 화면 바꾸기 →</Link>
          </li>
          <li className="py-3">
            <Link href="/admin/news/new">새 소식 쓰기 →</Link>
          </li>
          <li className="py-3">
            <Link href="/admin/officials">임원 카드 수정 →</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
