/* ── Props ── */
interface UserAvatarProps {
  /** 아바타에 표시할 이니셜(2자 권장). photoUrl 이 없을 때 fallback 으로 사용 */
  initials: string;
  /** 프로필 사진 URL. 없으면 이니셜 표시 */
  photoUrl?: string;
  /** 원형 지름(px). 기본 32px */
  size?: number;
  /** 접근성 라벨 — 스크린리더용 */
  alt?: string;
}

/**
 * 공용 사용자 아바타(User Avatar)
 *
 * - 원형, 레드 테두리 1px, 어두운 배경 위에 이니셜 또는 사진 표시
 * - Nav 프로필 버튼, 드롭다운 헤더, 모바일 드로어 등에서 재사용
 *
 * 디자인:
 *  - 기본 32px 이지만 size prop 으로 확대 가능 (40, 48 등)
 *  - 이니셜 색상은 kld-red, 배경은 dark-200 — 기존 KLD 팔레트와 일치
 */
export default function UserAvatar({
  initials,
  photoUrl,
  size = 32,
  alt = "사용자 아바타",
}: UserAvatarProps) {
  /* 폰트 크기는 지름에 비례하도록 계산 — 32px 기준 12px. */
  const fontSize = Math.max(10, Math.round(size * 0.38));

  return (
    <div
      className="
        relative shrink-0
        rounded-full overflow-hidden
        bg-dark-200 border border-kld-red
        flex items-center justify-center
      "
      style={{ width: size, height: size }}
      role="img"
      aria-label={alt}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className="font-display text-kld-red leading-none tracking-[0.04em]"
          style={{ fontSize }}
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </div>
  );
}
