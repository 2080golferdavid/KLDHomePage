import type { Metadata } from "next";
import Prose from "@/components/site/Prose";
import { getDocument } from "@/lib/content/repository";
import { formatKoDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "이용약관",
};

export default async function TermsPage() {
  const doc = await getDocument();
  const page = doc.legal.terms;
  return (
    <main className="kld-shell py-10 pb-16">
      <article className="kld-card mx-auto max-w-3xl p-6 sm:p-10">
        <h1 className="text-3xl font-black">{page.title}</h1>
        <p className="mt-2 text-xs text-kld-muted">업데이트 {formatKoDate(page.updatedAt)}</p>
        <div className="mt-8">
          <Prose text={page.body} />
        </div>
      </article>
    </main>
  );
}
