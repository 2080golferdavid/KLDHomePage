import type { MemberTier } from "@/hooks/useCurrentUser";

interface MembershipBadgeProps {
  tier: MemberTier;
  size?: "sm" | "md";
}

/**
 * 회원 등급(일반/정회원) 배지.
 * - 정회원: 액센트 배경 + 대비색 글씨(강조)
 * - 일반회원: 테두리만
 */
export default function MembershipBadge({
  tier,
  size = "md",
}: MembershipBadgeProps) {
  const isFull = tier === "full";
  const label = isFull ? "FULL · 정회원" : "GENERAL · 일반회원";

  const padding =
    size === "sm" ? "2px 8px" : "4px 10px";
  const fontSize = size === "sm" ? 9 : 10;

  return (
    <span
      aria-label={`회원 등급: ${label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--kld-font-mono)",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        border: "1px solid",
        padding,
        fontSize,
        fontWeight: 600,
        background: isFull ? "var(--accent)" : "transparent",
        color: isFull ? "var(--on-accent)" : "var(--kld-fg-3)",
        borderColor: isFull ? "var(--accent)" : "var(--kld-line-strong)",
      }}
    >
      {label}
    </span>
  );
}
