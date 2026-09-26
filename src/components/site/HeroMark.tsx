/** 선수 사진 대신 쓰는 단순한 장타 그래픽. 실제 기록 숫자는 넣지 않는다. */
export default function HeroMark() {
  return (
    <div className="relative hidden h-full min-h-[420px] overflow-hidden md:block" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.16),transparent_42%)]" />
      <svg viewBox="0 0 520 560" className="absolute inset-0 h-full w-full">
        <text x="40" y="460" fill="rgba(255,255,255,0.06)" fontSize="180" fontFamily="Arial Black, sans-serif">
          KLD
        </text>
        <path d="M70 430 C 160 250, 280 160, 470 90" fill="none" stroke="#E11D2E" strokeWidth="6" strokeLinecap="round" />
        <circle cx="470" cy="90" r="10" fill="#FFFFFF" />
        <circle cx="180" cy="250" r="120" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
        <circle cx="180" cy="250" r="70" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      </svg>
      <p className="absolute bottom-10 right-10 text-xs font-semibold tracking-[0.28em] text-white/60">
        LONG DRIVE
      </p>
    </div>
  );
}
