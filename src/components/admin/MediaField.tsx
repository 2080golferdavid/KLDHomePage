"use client";

import { useState } from "react";
import CmsImage from "@/components/site/CmsImage";

export default function MediaField({
  label,
  hint,
  value,
  emptyLabel,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  emptyLabel: string;
  onChange: (next: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const preview = value.trim();

  return (
    <div>
      <span className="kld-label">{label}</span>
      {hint && <p className="mb-2 text-xs leading-relaxed text-kld-muted">{hint}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-16 min-w-[8.5rem] items-center justify-center rounded-2xl border border-dashed border-kld-line bg-kld-paper px-3">
          {preview ? (
            <CmsImage src={preview} alt="" className="max-h-12 max-w-[140px] object-contain" />
          ) : (
            <span className="text-xs text-kld-muted">{emptyLabel}</span>
          )}
        </div>
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
              if (file.size > 450_000) {
                setError("파일은 450KB보다 작아야 합니다.");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                setError(null);
                onChange(String(reader.result || ""));
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        <button
          type="button"
          className="text-sm font-semibold text-kld-muted underline"
          onClick={() => {
            setError(null);
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
    </div>
  );
}
