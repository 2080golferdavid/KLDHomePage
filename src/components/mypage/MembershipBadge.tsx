import type { MemberTier } from "@/hooks/useCurrentUser";

/* ── Props ── */
interface MembershipBadgeProps {
  tier: MemberTier;
  size?: "sm" | "md";
}

/**
 * 회원 등급(일반/정회원) 을 나타내는 작은 배지.
 * - 정회원: 빨간 배경 + 흰 글씨 (강조)
 * - 일반회원: 테두리만 (은은하게)
 */
export default function MembershipBadge({
  tier,
  size = "md",
}: MembershipBadgeProps) {
  const isFull = tier === "full";
  const label = isFull ? "정회원" : "일반회원";

  const sizeClass =
    size === "sm"
      ? "text-[9px] px-2 py-0.5"
      : "text-[10px] px-2.5 py-1";

  return (
    <span
      className={`
        inline-flex items-center
        font-mono tracking-[0.2em] uppercase
        border
        ${sizeClass}
        ${isFull
          ? "bg-kld-red text-white-kld border-kld-red"
          : "text-gray-mid border-white/20"}
      `}
      aria-label={`회원 등급: ${label}`}
    >
      {label}
    </span>
  );
}
