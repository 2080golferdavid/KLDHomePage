"use client";

import { useRef, useState } from "react";
import { uploadPlayerPhoto } from "@/lib/mypage/profile";

/* ── Props ── */
interface PhotoUploaderProps {
  userId: string;
  /** 현재 저장된 사진 URL. 변경 전까지 미리보기에 표시된다. */
  currentPhotoUrl?: string;
  /** 이니셜 fallback — 사진 없을 때 표시 */
  initials: string;
  /** 업로드 성공 시 새 URL 을 부모에게 알린다. */
  onUploaded: (photoUrl: string) => void;
}

/**
 * 프로필 사진 업로더
 *
 * 동작:
 *  - 사진 영역 또는 "사진 변경" 버튼을 누르면 파일 선택 창 표시
 *  - 선택 즉시 업로드 액션을 호출(미리 보기는 업로드 성공 후 반영)
 *  - 업로드 중/에러 상태를 시각적으로 표시
 */
export default function PhotoUploader({
  userId,
  currentPhotoUrl,
  initials,
  onUploaded,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);
    const result = await uploadPlayerPhoto(userId, file);
    setLoading(false);

    /* 같은 파일을 다시 선택해도 onChange 가 발생하도록 value 초기화 */
    e.target.value = "";

    if (!result.success || !result.photoUrl) {
      setError(result.error ?? "업로드에 실패했습니다.");
      return;
    }
    onUploaded(result.photoUrl);
  }

  return (
    <div className="flex items-start gap-5 md:gap-6">
      {/* ── 사진 미리보기 영역 ── */}
      <button
        type="button"
        onClick={openPicker}
        disabled={loading}
        className="
          relative shrink-0
          w-[120px] h-[150px] md:w-[140px] md:h-[175px]
          border border-kld-red/30
          overflow-hidden
          disabled:opacity-60
        "
        style={{
          background:
            "linear-gradient(160deg, #1a0404 0%, #080303 100%)",
        }}
        aria-label="프로필 사진 변경"
      >
        {currentPhotoUrl ? (
          <img
            src={currentPhotoUrl}
            alt="프로필 사진 미리보기"
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="
              absolute inset-0 flex items-center justify-center
              font-display text-[52px] text-kld-red tracking-[0.04em]
            "
            aria-hidden="true"
          >
            {initials}
          </span>
        )}

        {/* 업로드 중 오버레이 */}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-mono text-[10px] tracking-[0.2em] text-white-kld uppercase">
            업로드 중...
          </div>
        ) : (
          <div
            className="
              absolute inset-x-0 bottom-0
              bg-black/60 font-mono text-[10px] tracking-[0.2em] text-white-kld uppercase
              py-1.5 text-center
              opacity-0 hover:opacity-100 transition-opacity
            "
          >
            사진 변경
          </div>
        )}
      </button>

      {/* ── 안내 + 버튼 ── */}
      <div className="flex flex-col gap-3">
        <div className="font-mono text-[10px] tracking-[0.24em] text-kld-red uppercase">
          Profile Photo
        </div>
        <p className="text-[13px] font-light leading-[1.6] text-gray-light">
          권장 비율 4:5, 5MB 이하의 JPG/PNG 이미지를 업로드해주세요.
          업로드한 사진은 자동으로 선수 페이지에 반영됩니다.
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={openPicker}
            disabled={loading}
            className="
              font-ui text-[11px] font-bold tracking-[0.2em] uppercase
              text-kld-red border border-kld-red px-4 py-2
              hover:bg-kld-red hover:text-white-kld transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "업로드 중..." : "사진 업로드"}
          </button>
          {currentPhotoUrl ? (
            <button
              type="button"
              onClick={() => onUploaded("")}
              disabled={loading}
              className="
                font-ui text-[11px] font-semibold tracking-[0.2em] uppercase
                text-gray-light border border-white/10 px-4 py-2
                hover:border-kld-red hover:text-white-kld transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              제거
            </button>
          ) : null}
        </div>

        {error ? (
          <div
            className="
              font-mono text-[11px] text-[#FF6060]
              border border-[#FF6060]/30 bg-[#FF6060]/[0.06]
              px-3 py-2
            "
            role="alert"
          >
            {error}
          </div>
        ) : null}
      </div>

      {/* 실제 파일 입력은 시각적으로 숨기고 버튼으로만 트리거 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
