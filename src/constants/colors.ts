/**
 * KLD 브랜드 색상 상수
 * Tailwind 클래스와 별개로, JS에서 동적으로 색상이 필요할 때 사용한다.
 * 예: SVG stroke 색상, 조건부 스타일 등
 */
const Colors = {
  red: "#C41E1E",
  redDark: "#8B0000",
  redLight: "#E03535",
  redDim: "rgba(196, 30, 30, 0.12)",

  black: "#080808",
  black2: "#111111",
  black3: "#1A1A1A",
  black4: "#2A2A2A",

  gray: "#444444",
  grayMid: "#888888",
  grayLight: "#BBBBBB",

  white: "#F5F5F5",
} as const;

export default Colors;
