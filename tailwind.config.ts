import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kld: {
          navy: "#0B1B33",
          "navy-2": "#16325C",
          red: "#E11D2E",
          "red-600": "#C01024",
          ink: "#121826",
          muted: "#5C677A",
          line: "#E4E8EF",
          paper: "#F3F5F8",
        },
      },
      fontFamily: {
        sans: ["Pretendard Variable", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 40px rgba(16, 24, 40, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
