import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getDocument } from "@/lib/content/repository";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#0B1B33",
};

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getDocument();
  const name = doc.settings.siteName || "한국장타협회";
  return {
    title: {
      default: name,
      template: `%s · ${name}`,
    },
    description: doc.settings.oneLiner,
    icons: {
      icon: `/api/brand/favicon?v=${encodeURIComponent(doc.settings.updatedAt)}`,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
