import type { Metadata } from "next";
import {
  Barlow_Condensed,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import "./globals.css";

/* ── 폰트 설정 ──
   레퍼런스 디자인 시스템(colors_and_type.css)에 맞춰
   디스플레이: Barlow Condensed (900 italic 포함)
   본문 영문: Inter
   모노: JetBrains Mono
   한글: Pretendard — globals.css 에서 CDN 으로 불러온다. */

const barlowCondensed = Barlow_Condensed({
  weight: ["300", "400", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/* ── 메타데이터: 검색엔진과 소셜 미디어에 표시되는 정보 ── */
export const metadata: Metadata = {
  title: "KLD · Korea Long Drive — 한국장타협회",
  description:
    "대한민국 최초 공식 롱 드라이브 챔피언십. Korea Long Drive Association (KLD) — 아마추어부터 오픈까지 기록을 만들고 챔피언을 탄생시킵니다.",
  keywords: ["장타", "골프", "롱드라이브", "KLD", "한국장타협회", "대회"],
  authors: [{ name: "KLD Korea Long Drive Association" }],
  openGraph: {
    title: "KLD · Korea Long Drive — 한국장타협회",
    description: "대한민국 최초 공식 롱 드라이브 챔피언십",
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
      data-accent="green"
      className={`${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* 모바일 브라우저 상단바 색상 — KLD Arena Black */}
        <meta name="theme-color" content="#0B0B0E" />
      </head>
      <body>
        {/* 최상단 고정 티커 — 라이브 스코어/속보 스크롤 */}
        <Ticker />

        {/* 전체 페이지 공통 상단 네비게이션 */}
        <Nav />

        {children}

        {/* 전체 페이지 공통 하단 푸터 */}
        <Footer />
      </body>
    </html>
  );
}
