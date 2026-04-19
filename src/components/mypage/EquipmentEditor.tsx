"use client";

import type { PlayerEquipment } from "@/types";

/* ── Props ── */
interface EquipmentEditorProps {
  items: PlayerEquipment[];
  onChange: (items: PlayerEquipment[]) => void;
}

/** 자주 쓰는 카테고리 — datalist 로 제안만 하고 자유 입력도 허용 */
const CATEGORY_SUGGESTIONS = [
  "드라이버",
  "샤프트",
  "볼",
  "글러브",
  "페어웨이우드",
  "아이언",
];

/**
 * 장비(Equipment) 편집기
 *
 * - 행(row) 단위로 추가/삭제 가능
 * - 각 행: 카테고리 / 브랜드 / 모델 / 비고(선택)
 * - onChange 콜백으로 전체 배열을 상위 폼 상태로 밀어 올린다(제어 컴포넌트 패턴).
 */
export default function EquipmentEditor({
  items,
  onChange,
}: EquipmentEditorProps) {
  function updateItem(index: number, patch: Partial<PlayerEquipment>) {
    const next = items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([
      ...items,
      { category: "", brand: "", model: "", note: "" },
    ]);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 빈 상태 */}
      {items.length === 0 ? (
        <p className="text-[13px] font-light text-gray-mid py-6 text-center border border-dashed border-kld-green/20">
          등록된 장비가 없습니다. 아래 &quot;장비 추가&quot; 버튼을 눌러 시작하세요.
        </p>
      ) : null}

      {items.map((item, index) => (
        <div
          key={index}
          className="
            grid grid-cols-1 md:grid-cols-[160px_1fr_1fr_auto] gap-2 md:gap-3
            p-3 md:p-4
            bg-dark-200 border border-kld-green/[0.15]
          "
        >
          {/* 카테고리 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`equip-cat-${index}`}
              className="font-mono text-[9px] tracking-[0.2em] text-gray-mid uppercase md:sr-only"
            >
              카테고리
            </label>
            <input
              id={`equip-cat-${index}`}
              type="text"
              value={item.category}
              onChange={(e) => updateItem(index, { category: e.target.value })}
              list={`equip-cat-suggestions-${index}`}
              placeholder="카테고리"
              className="input-equip"
            />
            <datalist id={`equip-cat-suggestions-${index}`}>
              {CATEGORY_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          {/* 브랜드 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`equip-brand-${index}`}
              className="font-mono text-[9px] tracking-[0.2em] text-gray-mid uppercase md:sr-only"
            >
              브랜드
            </label>
            <input
              id={`equip-brand-${index}`}
              type="text"
              value={item.brand}
              onChange={(e) => updateItem(index, { brand: e.target.value })}
              placeholder="예) Callaway"
              className="input-equip"
            />
          </div>

          {/* 모델 + 비고 */}
          <div className="flex flex-col gap-1.5 md:col-span-1">
            <label
              htmlFor={`equip-model-${index}`}
              className="font-mono text-[9px] tracking-[0.2em] text-gray-mid uppercase md:sr-only"
            >
              모델
            </label>
            <input
              id={`equip-model-${index}`}
              type="text"
              value={item.model}
              onChange={(e) => updateItem(index, { model: e.target.value })}
              placeholder="예) Paradym Ai Smoke MAX"
              className="input-equip"
            />
            <input
              type="text"
              value={item.note ?? ""}
              onChange={(e) => updateItem(index, { note: e.target.value })}
              placeholder="비고 (선택) — 로프트/샤프트 플렉스 등"
              className="input-equip"
            />
          </div>

          {/* 삭제 버튼 */}
          <div className="flex md:items-start justify-end">
            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label={`${index + 1}번째 장비 삭제`}
              className="
                font-ui text-[11px] font-semibold tracking-[0.18em] uppercase
                text-gray-light border border-white/10 px-3 py-2
                hover:border-kld-green hover:text-kld-green transition-colors
              "
            >
              삭제
            </button>
          </div>
        </div>
      ))}

      {/* 추가 버튼 */}
      <button
        type="button"
        onClick={addItem}
        className="
          font-ui text-[12px] font-bold tracking-[0.22em] uppercase
          text-kld-green border border-kld-green/50 border-dashed
          px-4 py-3
          hover:border-kld-green hover:bg-kld-green/[0.05] transition-colors
        "
      >
        + 장비 추가
      </button>

      <style jsx>{`
        .input-equip {
          width: 100%;
          padding: 0.625rem 0.75rem;
          background: #111111;
          border: 1px solid rgba(196, 30, 30, 0.18);
          color: #f5f5f5;
          font-size: 13px;
          transition: border-color 150ms;
        }
        .input-equip::placeholder {
          color: #888888;
        }
        .input-equip:focus {
          outline: none;
          border-color: #c41e1e;
        }
      `}</style>
    </div>
  );
}
