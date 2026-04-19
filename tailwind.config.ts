import type { Config } from "tailwindcss";

/**
 * KLD Tailwind 설정
 * 레퍼런스 디자인 시스템(colors_and_type)에 맞춰 확장한다.
 * 본 설정은 홈 이외의 페이지(/about, /competitions, ...)가 기존
 * Tailwind 유틸리티에 의존하고 있어서 레거시 색상 별칭을 함께 유지한다.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── KLD 브랜드(새 디자인 시스템) ── */
        kld: {
          /* 새 시스템 */
          black: "#0B0B0E",
          green: "#C8FF3E",
          "green-600": "#A8E020",
          red: "#E11D2E",
          "red-600": "#B5121F",
          /* 기존 페이지 호환용 레거시 */
          dark: "#8B0000",
          white: "#F5F5F5",
          gray: "#8B8F99",
        },
        /* 단계별 다크 톤 */
        dark: {
          DEFAULT: "#0B0B0E",
          100: "#17171B",
          200: "#222228",
          300: "#2E2E35",
        },
        /* 기존 컴포넌트 호환용 별칭 */
        gray: {
          kld: "#5B5F6A",
          mid: "#8B8F99",
          light: "#C7CAD1",
        },
        white: {
          kld: "#FFFFFF",
        },
      },

      /* ── 폰트 패밀리 ──
         globals.css 의 --kld-font-* 와 동기화. */
      fontFamily: {
        display: ["var(--font-barlow)", "Pretendard Variable", "sans-serif"],
        ui: ["var(--font-inter)", "Pretendard Variable", "sans-serif"],
        body: ["var(--font-inter)", "Pretendard Variable", "sans-serif"],
        kr: ["Pretendard Variable", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

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

      spacing: {
        nav: "72px",
      },
    },
  },
  plugins: [],
};

export default config;
