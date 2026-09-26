import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { getDocument } from "@/lib/content/repository";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const doc = await getDocument();

  return (
    <div className="flex min-h-screen flex-col bg-kld-paper text-kld-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        본문으로
      </a>
      <Header settings={doc.settings} />
      <div id="content" className="flex-1">
        {children}
      </div>
      <Footer settings={doc.settings} />
    </div>
  );
}
