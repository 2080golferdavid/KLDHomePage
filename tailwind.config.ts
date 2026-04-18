import type { Config } from "tailwindcss";

/**
 * KLD 프로젝트 Tailwind 설정
 * 기존 CSS 변수에서 추출한 색상/폰트 체계를 Tailwind 유틸리티로 사용할 수 있도록 확장한다.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── KLD 브랜드 색상 ──
         CSS 변수(--color-kld-*)와 동기화되어 있다.
         Tailwind 유틸리티: bg-kld-red, text-kld-black 등으로 사용 */
      colors: {
        kld: {
          red: "#C41E1E",
          dark: "#8B0000",
          black: "#080808",
          white: "#F5F5F5",
          gray: "#888888",
        },
        /* 단계별 다크 톤 — 카드/섹션 배경 구분용 */
        dark: {
          DEFAULT: "#080808",
          100: "#111111",
          200: "#1A1A1A",
          300: "#2A2A2A",
        },
        /* 기존 컴포넌트 호환용 별칭 */
        gray: {
          kld: "#444444",
          mid: "#888888",
          light: "#BBBBBB",
        },
        white: {
          kld: "#F5F5F5",
        },
      },

      /* ── 폰트 패밀리 ── */
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        ui: ["var(--font-barlow)", "sans-serif"],
        body: ["var(--font-noto)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },

      /* ── 커스텀 애니메이션 ── */
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(36px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 1s ease 0.15s both",
        "fade-in": "fade-in 1s ease 0.8s both",
        "fade-in-delayed": "fade-in 1s ease 1s both",
        ticker: "ticker 28s linear infinite",
        pulse: "pulse 1.5s infinite",
      },

      /* ── 간격 / 크기 ── */
      spacing: {
        nav: "72px",
      },
    },
  },
  plugins: [],
};

export default config;
