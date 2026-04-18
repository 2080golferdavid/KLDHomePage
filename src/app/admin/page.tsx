"use client";

import { useState } from "react";
import Link from "next/link";
import MemberApprovalTable from "@/components/admin/MemberApprovalTable";
import PaymentCodesTable from "@/components/admin/PaymentCodesTable";
import ResultInputForm from "@/components/admin/ResultInputForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";

/* ── 탭 식별자 ── */
type TabId = "members" | "codes" | "results";

const TABS: { id: TabId; label: string; summary: string }[] = [
  {
    id: "members",
    label: "회원 승인",
    summary: "pending 상태인 정회원 신청 목록을 검토하고 승인/반려합니다.",
  },
  {
    id: "codes",
    label: "인증코드",
    summary: "정회원 전환용 1회성 인증코드를 발급·폐기·사용 현황을 확인합니다.",
  },
  {
    id: "results",
    label: "대회 결과 입력",
    summary: "완료된 대회의 선수별 비거리·순위·포인트를 입력합니다.",
  },
];

/**
 * 관리자 전용(Admin) 페이지
 *
 * 권한 체크:
 *  - useCurrentUser 훅에서 role 을 읽어 'admin' 인지 확인한다.
 *  - 요청에 따라 user_metadata.role 기준으로 판정하지만,
 *    실제 운영에서는 app_metadata.role 로 판정하는 것이 안전하다.
 *    (user_metadata 는 사용자 본인이 수정 가능 → 권한 승격 위험)
 *
 * 최종 보안은 DB(RLS) 가 담당한다:
 *  - 이 화면에서 호출하는 모든 쓰기 액션은 schema.sql 의 is_admin() 정책에 의해
 *    관리자가 아닌 계정이 시도하면 거부된다.
 *  - 즉 이 페이지의 가드는 UX 편의이며, 보안의 "두 번째 방어선" 이다.
 */
export default function AdminPage() {
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const [tab, setTab] = useState<TabId>("members");

  /* ════════════════════
      비로그인 / 비관리자 가드
  ════════════════════ */
  if (!user) {
    return (
      <GuardPage
        title="로그인이 필요합니다"
        message="관리자 페이지는 관리자 계정으로 로그인해야 접근할 수 있습니다."
      />
    );
  }

  if (!isAdmin) {
    return (
      <GuardPage
        title="접근 권한이 없습니다"
        message="이 페이지는 관리자(role='admin')만 이용할 수 있습니다. 잘못된 경로로 접근하셨다면 홈으로 돌아가주세요."
      />
    );
  }

  const currentTab = TABS.find((t) => t.id === tab)!;

  return (
    <main className="pt-nav bg-dark min-h-screen">
      <div className="max-w-[1120px] mx-auto px-5 md:px-8 py-12 md:py-16">
        {/* ── 헤더 ── */}
        <header className="mb-10 md:mb-12">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-3">
                KLD · Admin Console
              </div>
              <h1 className="font-display text-[clamp(36px,5vw,60px)] leading-[1] tracking-[0.02em] text-white-kld mb-2">
                관리자 페이지
              </h1>
            </div>
            <div className="flex flex-col items-end gap-1 pt-2">
              <span className="font-mono text-[10px] tracking-[0.18em] text-kld-red uppercase">
                Signed in — {user.id}
              </span>
              <span className="font-mono text-[9px] tracking-[0.22em] text-gray-mid uppercase">
                Role · {user.role}
              </span>
            </div>
          </div>
        </header>

        {/* ── 탭 바 ── */}
        <nav
          role="tablist"
          aria-label="관리자 섹션"
          className="flex border border-kld-red/20 overflow-x-auto scrollbar-none mb-6"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`
                  flex-1 md:flex-none
                  font-ui text-[12px] md:text-[13px]
                  font-semibold tracking-[0.14em] uppercase
                  px-4 md:px-7 py-3 md:py-3.5
                  whitespace-nowrap
                  border-r border-kld-red/20 last:border-r-0
                  transition-colors
                  ${active
                    ? "bg-kld-red text-white-kld"
                    : "text-gray-mid hover:text-white-kld"}
                `}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* ── 선택된 탭 설명 ── */}
        <p className="text-[13px] font-light leading-[1.7] text-gray-light mb-8 max-w-[720px]">
          {currentTab.summary}
        </p>

        {/* ── 탭 패널 ── */}
        <section
          role="tabpanel"
          aria-label={currentTab.label}
          className="
            bg-dark-200 border border-kld-red/[0.15]
            p-5 md:p-7
          "
        >
          {tab === "members" ? <MemberApprovalTable /> : null}
          {tab === "codes" ? <PaymentCodesTable /> : null}
          {tab === "results" ? <ResultInputForm /> : null}
        </section>

        {/* ── 보안 안내 ── */}
        <footer className="mt-10 flex items-start gap-3 text-[11px] font-light text-gray-mid leading-[1.7]">
          <span
            className="
              shrink-0 inline-flex items-center justify-center
              w-5 h-5 border border-white/20 text-gray-mid
              font-mono text-[10px]
            "
            aria-hidden="true"
          >
            i
          </span>
          <p>
            이 화면의 모든 변경 사항은 서버(Supabase) 의 Row Level Security
            정책에 의해 한 번 더 검증됩니다. 관리자 권한이 없는 사용자가
            액션을 시도하면 프런트엔드 가드를 우회해도 DB 에서 거부됩니다.
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ══════════════════════════════════════════
   내부 헬퍼: 접근 차단 화면
══════════════════════════════════════════ */
interface GuardPageProps {
  title: string;
  message: string;
}

function GuardPage({ title, message }: GuardPageProps) {
  return (
    <main className="pt-nav bg-dark min-h-screen">
      <div className="max-w-[560px] mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
        <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-3">
          Admin Console
        </div>
        <h1 className="font-display text-[clamp(32px,4vw,48px)] leading-[1.05] tracking-[0.02em] text-white-kld mb-3">
          {title}
        </h1>
        <p className="text-[14px] font-light leading-[1.7] text-gray-light mb-8">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="
              inline-flex items-center justify-center
              font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
              bg-kld-red px-6 py-3.5
              hover:bg-kld-red-light transition-colors
            "
          >
            홈으로
          </Link>
          <Link
            href="/auth/register"
            className="
              inline-flex items-center justify-center
              font-ui text-[13px] font-semibold tracking-[0.22em] uppercase text-gray-light
              border border-white/10 px-6 py-3.5
              hover:border-kld-red hover:text-white-kld transition-colors
            "
          >
            로그인 / 가입
          </Link>
        </div>
      </div>
    </main>
  );
}
