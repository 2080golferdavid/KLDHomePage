/* ── Props ── */
interface UserAvatarProps {
  initials: string;
  photoUrl?: string;
  /** 원형 지름(px). 기본 36px */
  size?: number;
  alt?: string;
}

/**
 * 공용 사용자 아바타.
 * 사각 테두리 + 액센트 강조선으로 방송 그래픽 스타일과 결이 맞도록 조정.
 * Nav 프로필 버튼, 사이드바, 드로어 등에서 재사용된다.
 */
export default function UserAvatar({
  initials,
  photoUrl,
  size = 36,
  alt = "사용자 아바타",
}: UserAvatarProps) {
  const fontSize = Math.max(10, Math.round(size * 0.38));

  return (
    <div
      role="img"
      aria-label={alt}
      style={{
        position: "relative",
        flexShrink: 0,
        width: size,
        height: size,
        display: "grid",
        placeItems: "center",
        background: "var(--kld-surface-2)",
        border: "1px solid var(--kld-line-strong)",
        overflow: "hidden",
      }}
    >
      {photoUrl ? (
        /* next/image 의 fill 을 쓸 수도 있으나 아바타 같은 작은 치수는
           일반 <img> 가 간결하다. 큰 사진은 detail 페이지에서 next/image 처리. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--kld-font-display)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize,
            color: "var(--accent)",
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
