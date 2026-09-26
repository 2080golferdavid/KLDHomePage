import Link from "next/link";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { getDocument } from "@/lib/content/repository";

export default async function NotFound() {
  const doc = await getDocument();

  return (
    <div className="flex min-h-screen flex-col bg-kld-paper">
      <Header settings={doc.settings} />
      <main className="kld-shell flex flex-1 flex-col items-start justify-center py-16">
        <p className="text-xs font-semibold tracking-[0.18em] text-kld-red">404</p>
        <h1 className="mt-3 text-4xl font-black">페이지를 찾지 못했습니다.</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-kld-muted">
          주소가 바뀌었거나, 아직 열리지 않은 메뉴일 수 있습니다. 대회 신청과 회원 페이지는 다음 단계입니다.
        </p>
        <Link href="/" className="kld-btn-navy mt-6">
          홈으로
        </Link>
      </main>
      <Footer settings={doc.settings} />
    </div>
  );
}
