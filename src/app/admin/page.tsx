"use client";

import { useState } from "react";
import Link from "next/link";
import MemberApprovalTable from "@/components/admin/MemberApprovalTable";
import PaymentCodesTable from "@/components/admin/PaymentCodesTable";
import ResultInputForm from "@/components/admin/ResultInputForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type TabId = "members" | "codes" | "results";

const TABS: { id: TabId; en: string; kr: string; summary: string }[] = [
  {
    id: "members",
    en: "MEMBERS",
    kr: "회원 승인",
    summary:
      "pending 상태인 정회원 신청 목록을 검토하고 승인/반려합니다.",
  },
  {
    id: "codes",
    en: "CODES",
    kr: "인증코드",
    summary:
      "정회원 전환용 1회성 인증코드를 발급·폐기·사용 현황을 확인합니다.",
  },
  {
    id: "results",
    en: "RESULTS",
    kr: "대회 결과",
    summary: "완료된 대회의 선수별 비거리·순위·포인트를 입력합니다.",
  },
];

/**
 * 관리자 콘솔.
 * useCurrentUser.role === "admin" 일 때만 탭을 렌더링.
 * 실제 보안은 DB(RLS)의 is_admin() 정책이 담당한다 — 이 가드는 UX 편의.
 */
export default function AdminPage() {
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const [tab, setTab] = useState<TabId>("members");

  if (!user) {
    return (
      <GuardPage
        title="LOG IN REQUIRED"
        titleKr="로그인이 필요합니다"
        message="관리자 페이지는 관리자 계정으로 로그인해야 접근할 수 있습니다."
      />
    );
  }

  if (!isAdmin) {
    return (
      <GuardPage
        title="NO ACCESS"
        titleKr="접근 권한이 없습니다"
        message="이 페이지는 관리자(role='admin')만 이용할 수 있습니다."
      />
    );
  }

  const currentTab = TABS.find((t) => t.id === tab)!;

  return (
    <main style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <div className="wrap" style={{ maxWidth: 1200 }}>
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          <div>
            <div className="sec-eyebrow">ADMIN CONSOLE · 관리자 콘솔</div>
            <h1
              className="sec-title"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              CONTROL ROOM<span className="kr">관리자 페이지</span>
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              className="kld-caption-mono"
              style={{ color: "var(--accent)" }}
            >
              SIGNED IN — {user.id}
            </div>
            <div
              className="kld-caption-mono"
              style={{ color: "var(--kld-fg-4)", marginTop: 4 }}
            >
              ROLE · {user.role}
            </div>
          </div>
        </header>

        <nav
          className="tabs"
          role="tablist"
          aria-label="관리자 섹션"
          style={{ marginBottom: 20, width: "100%", overflowX: "auto" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`tab ${tab === t.id ? "is-active" : ""}`}
              onClick={() => setTab(t.id)}
              style={{ flex: 1 }}
            >
              {t.en}
              <span className="kr">{t.kr}</span>
            </button>
          ))}
        </nav>

        <p
          className="kld-caption-kr"
          style={{
            marginBottom: 28,
            maxWidth: 720,
            color: "var(--kld-fg-2)",
          }}
        >
          {currentTab.summary}
        </p>

        <section
          role="tabpanel"
          aria-label={currentTab.kr}
          className="panel"
          style={{ padding: 28 }}
        >
          {tab === "members" ? <MemberApprovalTable /> : null}
          {tab === "codes" ? <PaymentCodesTable /> : null}
          {tab === "results" ? <ResultInputForm /> : null}
        </section>

        <footer
          style={{
            marginTop: 32,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              display: "inline-grid",
              placeItems: "center",
              width: 20,
              height: 20,
              border: "1px solid var(--kld-line-strong)",
              color: "var(--kld-fg-3)",
              fontFamily: "var(--kld-font-mono)",
              fontSize: 10,
            }}
          >
            i
          </span>
          <p
            className="kld-caption-kr"
            style={{ fontSize: 11, lineHeight: 1.7 }}
          >
            이 화면의 모든 변경 사항은 서버(Supabase) 의 Row Level Security
            정책으로 한 번 더 검증됩니다. 관리자 권한이 없는 사용자가 액션을
            시도하면 프런트엔드 가드를 우회해도 DB 에서 거부됩니다.
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
  titleKr: string;
  message: string;
}

function GuardPage({ title, titleKr, message }: GuardPageProps) {
  return (
    <main style={{ minHeight: "100vh", paddingTop: 140, paddingBottom: 96 }}>
      <div className="wrap" style={{ maxWidth: 600, textAlign: "center" }}>
        <div className="sec-eyebrow" style={{ justifyContent: "center" }}>
          ADMIN CONSOLE · 관리자 콘솔
        </div>
        <h1
          className="sec-title"
          style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
        >
          {title}
          <span className="kr">{titleKr}</span>
        </h1>
        <p
          className="kld-caption-kr"
          style={{ margin: "24px auto 32px", maxWidth: 440 }}
        >
          {message}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" className="btn btn-primary">
            홈으로 <span className="arrow">→</span>
          </Link>
          <Link href="/auth/login" className="btn btn-secondary">
            LOG IN · 로그인
          </Link>
        </div>
      </div>
    </main>
  );
}
