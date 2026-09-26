"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import CmsImage from "@/components/site/CmsImage";
import { HEADER_LOGO_CLASS } from "@/components/site/logoStyle";
import { LOGO_SOURCE_MAX_BYTES, MAX_MEDIA_FILE_BYTES } from "@/lib/content/urls";

const LogoCropDialog = dynamic(() => import("@/components/admin/LogoCropDialog"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0B1B33]/55 p-4">
      <p className="kld-card px-6 py-5 text-sm font-semibold">자르기 창을 여는 중…</p>
    </div>
  ),
});

function readFile(file: File, onLoad: (dataUrl: string) => void, onError: () => void) {
  const reader = new FileReader();
  reader.onload = () => onLoad(String(reader.result || ""));
  reader.onerror = () => onError();
  reader.readAsDataURL(file);
}

export default function MediaField({
  label,
  hint,
  value,
  emptyLabel,
  onChange,
  cropLogo = false,
}: {
  label: string;
  hint?: string;
  value: string;
  emptyLabel: string;
  onChange: (next: string) => void;
  /** 로고만 자르기 창을 연다. 파비콘·히어로·임원 사진은 그대로 둔다. */
  cropLogo?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [editorSrc, setEditorSrc] = useState<string | null>(null);
  const preview = value.trim();

  return (
    <div>
      <span className="kld-label">{label}</span>
      {hint && <p className="mb-2 text-xs leading-relaxed text-kld-muted">{hint}</p>}
      <div className={`flex flex-wrap gap-3 ${cropLogo && preview ? "items-end" : "items-center"}`}>
        {cropLogo && preview ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <figure>
              <figcaption className="mb-1 text-xs text-kld-muted">헤더 크기</figcaption>
              <div className="kld-checker flex min-h-16 min-w-[12rem] items-center justify-center rounded-2xl border border-dashed border-kld-line px-3 py-2">
                <CmsImage src={preview} alt="" className={HEADER_LOGO_CLASS} />
              </div>
            </figure>
            <figure>
              <figcaption className="mb-1 text-xs text-kld-muted">크게 보기</figcaption>
              <div className="kld-checker flex min-h-28 min-w-[14rem] items-center justify-center rounded-2xl border border-dashed border-kld-line px-3 py-2">
                <CmsImage src={preview} alt="" className="max-h-24 w-auto max-w-[280px] object-contain" />
              </div>
            </figure>
          </div>
        ) : (
          <div className="flex h-16 min-w-[8.5rem] items-center justify-center rounded-2xl border border-dashed border-kld-line bg-kld-paper px-3">
            {preview ? (
              <CmsImage src={preview} alt="" className="max-h-12 max-w-[140px] object-contain" />
            ) : (
              <span className="text-xs text-kld-muted">{emptyLabel}</span>
            )}
          </div>
        )}
        <label className="kld-btn-line cursor-pointer">
          파일 올리기
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              if (cropLogo) {
                if (file.size > LOGO_SOURCE_MAX_BYTES) {
                  setError("원본 파일은 8MB보다 작아야 합니다.");
                  return;
                }
                readFile(
                  file,
                  (dataUrl) => {
                    setError(null);
                    setEditorSrc(dataUrl);
                  },
                  () => setError("파일을 읽지 못했습니다."),
                );
                return;
              }
              if (file.size > MAX_MEDIA_FILE_BYTES) {
                setError("파일은 450KB보다 작아야 합니다.");
                return;
              }
              readFile(
                file,
                (dataUrl) => {
                  setError(null);
                  onChange(dataUrl);
                },
                () => setError("파일을 읽지 못했습니다."),
              );
            }}
          />
        </label>
        {cropLogo && preview && (
          <button
            type="button"
            className="kld-btn-line"
            onClick={() => {
              setError(null);
              setEditorSrc(preview);
            }}
          >
            자르기
          </button>
        )}
        <button
          type="button"
          className="text-sm font-semibold text-kld-muted underline"
          onClick={() => {
            setError(null);
            setEditorSrc(null);
            onChange("");
          }}
        >
          기본으로
        </button>
      </div>
      <input
        className="kld-input mt-2"
        placeholder="https:// 로 시작하는 주소. 비우면 기본 그림"
        value={preview.startsWith("data:") ? "" : preview}
        onChange={(event) => onChange(event.target.value)}
      />
      {preview.startsWith("data:") && (
        <p className="mt-1 text-xs text-kld-muted">올린 파일이 선택되어 있습니다. 주소를 적으면 파일 대신 그 주소를 씁니다.</p>
      )}
      {error && <p className="mt-1 text-xs text-kld-red">{error}</p>}
      {editorSrc && (
        <LogoCropDialog
          source={editorSrc}
          onCancel={() => setEditorSrc(null)}
          onApply={(dataUrl) => {
            setError(null);
            onChange(dataUrl);
            setEditorSrc(null);
          }}
        />
      )}
    </div>
  );
}
