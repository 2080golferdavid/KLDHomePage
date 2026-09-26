import type { Metadata } from "next";
import Prose from "@/components/site/Prose";
import { getDocument } from "@/lib/content/repository";
import { formatKoDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

export default async function PrivacyPage() {
  const doc = await getDocument();
  const page = doc.legal.privacy;
  return (
    <main className="kld-shell py-10 pb-16">
      <article className="kld-card mx-auto max-w-3xl p-6 sm:p-10">
        {page.isDraft && (
          <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            법률 검토 전 임시 초안입니다. 확정된 방침이 아닙니다.
          </p>
        )}
        <h1 className="text-3xl font-black">{page.title}</h1>
        <p className="mt-2 text-xs text-kld-muted">업데이트 {formatKoDate(page.updatedAt)}</p>
        <div className="mt-8">
          <Prose text={page.body} />
        </div>
      </article>
    </main>
  );
}
