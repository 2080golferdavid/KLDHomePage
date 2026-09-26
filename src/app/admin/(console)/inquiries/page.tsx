import { getDocument } from "@/lib/content/repository";
import { formatKoDate } from "@/lib/format";

export default async function InquiriesPage() {
  const doc = await getDocument();

  return (
    <div>
      <h1 className="text-3xl font-black">문의함</h1>
      <p className="mt-2 text-sm text-kld-muted">연락 페이지 폼으로 들어온 글입니다. 공개 사이트에는 보이지 않습니다.</p>
      {doc.inquiries.length === 0 ? (
        <p className="kld-card mt-6 p-6 text-sm text-kld-muted">아직 문의가 없습니다.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {doc.inquiries.map((item) => (
            <li key={item.id} className="kld-card p-5">
              <p className="text-sm font-bold">
                {item.name} · {item.email}
              </p>
              <p className="mt-1 text-xs text-kld-muted">{formatKoDate(item.createdAt)}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{item.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
