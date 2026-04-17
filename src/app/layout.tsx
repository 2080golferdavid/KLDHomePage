import type { Metadata } from "next";
import {
  Bebas_Neue,
  Barlow_Condensed,
  Noto_Sans_KR,
  DM_Mono,
} from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

/* ── Google Fonts 설정 ──
   next/font를 사용하면 빌드 시 폰트를 최적화하고,
   외부 네트워크 요청 없이 self-hosting 된다. */

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["300", "400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

/* ── 메타데이터: 검색엔진과 소셜 미디어에 표시되는 정보 ── */
export const metadata: Metadata = {
  title: "KLD — Korea Long Drive Association",
  description:
    "한국 장타 스포츠의 표준 — KLD Korea Long Drive Association. 아마추어부터 오픈까지, 기록을 만들고 챔피언을 탄생시킵니다.",
  keywords: ["장타", "골프", "롱드라이브", "KLD", "한국장타협회", "대회"],
  authors: [{ name: "KLD Korea Long Drive Association" }],
  openGraph: {
    title: "KLD — Korea Long Drive Association",
    description: "한국 장타 스포츠의 표준",
    type: "website",
    locale: "ko_KR",
  },
};

/* ── 루트 레이아웃: 모든 페이지를 감싸는 최상위 컴포넌트 ── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`
        ${bebasNeue.variable}
        ${barlowCondensed.variable}
        ${notoSansKR.variable}
        ${dmMono.variable}
      `}
    >
      <head>
        {/* 모바일 브라우저 상단바 색상 */}
        <meta name="theme-color" content="#080808" />
      </head>
      <body className="font-body antialiased">
        {/* 모든 페이지에 공통으로 표시되는 상단 네비게이션 */}
        <Nav />

        {children}

        {/* 모든 페이지에 공통으로 표시되는 하단 푸터 */}
        <Footer />
      </body>
    </html>
  );
}
