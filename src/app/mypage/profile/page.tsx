"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import EquipmentEditor from "@/components/mypage/EquipmentEditor";
import PhotoUploader from "@/components/mypage/PhotoUploader";
import ReadOnlyStats from "@/components/mypage/ReadOnlyStats";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getPlayerById } from "@/data/players";
import { updatePlayerProfile } from "@/lib/mypage/profile";
import type { Division, PlayerProfile } from "@/types";

/** 디비전 옵션 (DB enum 과 일치) */
const DIVISIONS: Division[] = ["아마추어", "마스터즈", "우먼스", "오픈"];

/** 편집 가능한 필드만 모아 관리하는 폼 상태 */
interface FormState {
  photoUrl: string;
  bio: string;
  division: Division;
  region: string;
  equipment: PlayerProfile["equipment"];
  instagram: string;
  youtube: string;
}

/* 빈 폼 상태 — 프로필 로딩 실패/초기화에 사용 */
const EMPTY_FORM: FormState = {
  photoUrl: "",
  bio: "",
  division: "아마추어",
  region: "",
  equipment: [],
  instagram: "",
  youtube: "",
};

/**
 * 마이페이지 — 프로필 편집(My Profile)
 *
 * 동작:
 *  1) 로그인 여부 확인(useCurrentUser). 비로그인 → 안내 + 가입/로그인 링크
 *  2) 로그인된 userId 로 players.getPlayerById 호출 → 기존 프로필 로드
 *  3) 편집 가능한 필드는 상단, 편집 불가(read-only) 항목은 하단에 배치
 *  4) "저장하기" 클릭 시 updatePlayerProfile 액션 호출
 *
 * 주의:
 *  - 서버 사이드(RLS)에서도 본인(user_id = auth.uid()) 만 update 가능하도록
 *    이미 schema.sql 의 players_update_self_or_admin 정책이 보호하고 있다.
 *  - 이 페이지는 UX 레이어일 뿐이며, 실제 권한 보장은 DB 정책이 한다.
 */
export default function MyProfilePage() {
  const user = useCurrentUser();

  /* ── 로딩/에러/저장 상태 ── */
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successAt, setSuccessAt] = useState<number | null>(null);

  /* ── 프로필 로드 ──
     useCurrentUser 는 초기 마운트 시점에 null 을 반환했다가,
     다음 렌더에서 localStorage 값으로 업데이트될 수 있으므로
     user 가 바뀔 때마다 재로딩한다. */
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const p = await getPlayerById(user.id);
      if (cancelled) return;

      setPlayer(p);
      if (p) {
        setForm({
          photoUrl: p.photoUrl ?? "",
          bio: p.bio,
          division: p.division,
          region: p.region,
          equipment: [...p.equipment],
          instagram: p.social?.instagram ?? "",
          youtube: p.social?.youtube ?? "",
        });
      }
      setLoading(false);
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user]);

  /* ── 필드 업데이트 헬퍼 ── */
  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  /* ── 저장 ── */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccessAt(null);
    setSaving(true);

    const result = await updatePlayerProfile(user.id, {
      photoUrl: form.photoUrl || undefined,
      bio: form.bio,
      division: form.division,
      region: form.region,
      equipment: form.equipment,
      social:
        form.instagram || form.youtube
          ? {
              instagram: form.instagram || undefined,
              youtube: form.youtube || undefined,
            }
          : undefined,
    });
    setSaving(false);

    if (!result.success) {
      setError(result.error ?? "저장에 실패했습니다.");
      return;
    }
    setSuccessAt(Date.now());
  }

  /* ════════════════════
      분기 1 — 비로그인
  ════════════════════ */
  if (!loading && !user) {
    return (
      <main className="pt-nav bg-dark min-h-screen">
        <GuardScreen
          title="로그인이 필요합니다"
          message="마이페이지는 로그인한 회원만 이용할 수 있습니다."
          primaryHref="/auth/register"
          primaryLabel="회원가입하기"
          secondaryHref="/"
          secondaryLabel="홈으로"
        />
      </main>
    );
  }

  /* ════════════════════
      분기 2 — 로딩
  ════════════════════ */
  if (loading) {
    return (
      <main className="pt-nav bg-dark min-h-screen">
        <div className="max-w-[880px] mx-auto px-5 md:px-8 py-20">
          <div className="font-mono text-[11px] tracking-[0.24em] text-gray-mid uppercase">
            프로필을 불러오는 중...
          </div>
        </div>
      </main>
    );
  }

  /* ════════════════════
      분기 3 — 프로필 없음(선수 등록 전)
  ════════════════════ */
  if (!player) {
    return (
      <main className="pt-nav bg-dark min-h-screen">
        <GuardScreen
          title="선수 프로필이 없습니다"
          message="회원가입 마지막 단계에서 선수 프로필을 입력해야 편집할 수 있습니다."
          primaryHref="/auth/register"
          primaryLabel="프로필 만들기"
          secondaryHref="/players"
          secondaryLabel="선수 목록 보기"
        />
      </main>
    );
  }

  /* ════════════════════
      정상 — 편집 화면
  ════════════════════ */
  return (
    <main className="pt-nav bg-dark min-h-screen">
      <div className="max-w-[880px] mx-auto px-5 md:px-8 py-12 md:py-16 lg:py-20">
        {/* ── 헤더 ── */}
        <header className="flex items-start justify-between gap-4 mb-10 md:mb-12">
          <div>
            <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-3">
              My Profile
            </div>
            <h1 className="font-display text-[clamp(36px,5vw,60px)] leading-[1] tracking-[0.02em] text-white-kld mb-2">
              프로필 편집
            </h1>
            <p className="text-[14px] font-light leading-[1.7] text-gray-light max-w-[560px]">
              선수 페이지에 노출되는 정보를 직접 관리할 수 있습니다. 변경 사항은
              저장 버튼을 눌러야 반영됩니다.
            </p>
          </div>
          <Link
            href={`/players/${player.id}`}
            className="
              font-mono text-[10px] tracking-[0.2em] uppercase
              text-gray-mid hover:text-kld-red transition-colors
              whitespace-nowrap pt-2
            "
          >
            내 공개 프로필 보기 →
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10 md:gap-12">
          {/* ════════════════════
              1. 사진 업로더(편집 가능)
          ════════════════════ */}
          <SectionBlock title="프로필 사진" editable>
            <PhotoUploader
              userId={player.id}
              currentPhotoUrl={form.photoUrl}
              initials={player.initials}
              onUploaded={(url) => updateField("photoUrl", url)}
            />
          </SectionBlock>

          {/* ════════════════════
              2. 기본 정보(자기소개 / 소속 / 지역) — 편집 가능
          ════════════════════ */}
          <SectionBlock title="기본 정보" editable>
            <div className="flex flex-col gap-5">
              {/* 자기소개 */}
              <Field label="자기소개" htmlFor="field-bio">
                <textarea
                  id="field-bio"
                  rows={4}
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="간단한 소개, 주특기, 시즌 목표 등을 자유롭게 적어주세요."
                  className="input-kld resize-none"
                />
              </Field>

              {/* 소속(디비전) + 지역 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="소속 디비전" htmlFor="field-division">
                  <select
                    id="field-division"
                    value={form.division}
                    onChange={(e) =>
                      updateField("division", e.target.value as Division)
                    }
                    className="input-kld"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="활동 지역" htmlFor="field-region" required>
                  <input
                    id="field-region"
                    type="text"
                    value={form.region}
                    onChange={(e) => updateField("region", e.target.value)}
                    placeholder="예) SEOUL"
                    className="input-kld"
                  />
                </Field>
              </div>
            </div>
          </SectionBlock>

          {/* ════════════════════
              3. 장비 — 편집 가능
          ════════════════════ */}
          <SectionBlock title="장비 정보" editable>
            <EquipmentEditor
              items={form.equipment}
              onChange={(items) => updateField("equipment", items)}
            />
          </SectionBlock>

          {/* ════════════════════
              4. SNS 링크 — 편집 가능
          ════════════════════ */}
          <SectionBlock title="SNS 링크" editable>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Instagram" htmlFor="field-instagram">
                <input
                  id="field-instagram"
                  type="text"
                  value={form.instagram}
                  onChange={(e) => updateField("instagram", e.target.value)}
                  placeholder="@username"
                  className="input-kld"
                />
              </Field>
              <Field label="YouTube" htmlFor="field-youtube">
                <input
                  id="field-youtube"
                  type="text"
                  value={form.youtube}
                  onChange={(e) => updateField("youtube", e.target.value)}
                  placeholder="채널명 또는 핸들"
                  className="input-kld"
                />
              </Field>
            </div>
          </SectionBlock>

          {/* ── 에러/성공 피드백 ── */}
          {error ? (
            <div
              className="
                font-mono text-[11px] text-[#FF6060]
                border border-[#FF6060]/30 bg-[#FF6060]/[0.06]
                px-3 py-2.5
              "
              role="alert"
            >
              {error}
            </div>
          ) : null}
          {successAt ? (
            <div
              className="
                font-mono text-[11px] text-[#5FD17A]
                border border-[#5FD17A]/30 bg-[#5FD17A]/[0.06]
                px-3 py-2.5
              "
              role="status"
            >
              ✓ 프로필이 저장되었습니다.
            </div>
          ) : null}

          {/* ── 저장/취소 버튼 ── */}
          <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-6">
            <Link
              href={`/players/${player.id}`}
              className="
                font-ui text-[12px] font-semibold tracking-[0.2em] uppercase text-gray-light
                border border-white/10 px-5 py-3
                hover:border-kld-red hover:text-white-kld transition-colors
              "
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex items-center justify-center
                font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
                bg-kld-red px-6 py-3.5
                hover:bg-kld-red-light transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {saving ? "저장 중..." : "변경 사항 저장"}
            </button>
          </div>
        </form>

        {/* ════════════════════
            5. 편집 불가 항목 — 읽기 전용
        ════════════════════ */}
        <section className="mt-14 md:mt-20 pt-10 md:pt-14 border-t border-kld-red/[0.15]">
          <ReadOnlyStats player={player} />
        </section>
      </div>

      <style jsx global>{`
        .input-kld {
          width: 100%;
          padding: 0.875rem 1rem;
          background: #1a1a1a;
          border: 1px solid rgba(196, 30, 30, 0.2);
          color: #f5f5f5;
          font-size: 14px;
          transition: border-color 150ms;
        }
        .input-kld::placeholder {
          color: #888888;
        }
        .input-kld:focus {
          outline: none;
          border-color: #c41e1e;
        }
      `}</style>
    </main>
  );
}

/* ══════════════════════════════════════════
   내부 헬퍼 컴포넌트
══════════════════════════════════════════ */

/** 섹션 래퍼 — 공통 제목 + "편집 가능" 배지 */
interface SectionBlockProps {
  title: string;
  editable: boolean;
  children: React.ReactNode;
}

function SectionBlock({ title, editable, children }: SectionBlockProps) {
  return (
    <section aria-label={title}>
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display text-[22px] md:text-[26px] tracking-[0.03em] text-white-kld">
          {title}
        </h2>
        <span
          className={`
            font-mono text-[9px] tracking-[0.22em] uppercase
            px-2 py-0.5 border
            ${editable
              ? "text-kld-red border-kld-red/50"
              : "text-gray-mid border-white/15"}
          `}
        >
          {editable ? "Editable" : "Read-only"}
        </span>
      </div>
      {children}
    </section>
  );
}

/** 필드 라벨 + children 슬롯 */
interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, htmlFor, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase flex items-center gap-2"
      >
        {label}
        {required ? (
          <span className="text-kld-red" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}

/** 비로그인/프로필 없음 상태를 위한 가드 화면 */
interface GuardScreenProps {
  title: string;
  message: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

function GuardScreen({
  title,
  message,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: GuardScreenProps) {
  return (
    <div className="max-w-[560px] mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
      <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-3">
        My Profile
      </div>
      <h1 className="font-display text-[clamp(32px,4vw,48px)] leading-[1.05] tracking-[0.02em] text-white-kld mb-3">
        {title}
      </h1>
      <p className="text-[14px] font-light leading-[1.7] text-gray-light mb-8">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={primaryHref}
          className="
            inline-flex items-center justify-center
            font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
            bg-kld-red px-6 py-3.5
            hover:bg-kld-red-light transition-colors
          "
        >
          {primaryLabel} →
        </Link>
        <Link
          href={secondaryHref}
          className="
            inline-flex items-center justify-center
            font-ui text-[13px] font-semibold tracking-[0.22em] uppercase text-gray-light
            border border-white/10 px-6 py-3.5
            hover:border-kld-red hover:text-white-kld transition-colors
          "
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
