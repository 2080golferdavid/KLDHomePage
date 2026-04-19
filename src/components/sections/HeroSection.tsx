"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BI_COUNTDOWN_ISO, BI_HERO_STATS } from "@/constants/homeData";

/**
 * 히어로 섹션 — 방송형 풀스크린 비주얼.
 * 배경: 라디얼 그래디언트 + 격자 + 탄도 트레이스 SVG + 크게 떠 있는 "432" 기록 숫자.
 * 전경: EYEBROW / 타이틀(GO LONG.) / 리드 카피 / CTA / 하단 스탯 스트립.
 * 우측 상단: 다음 대회 카운트다운 카드(모바일에서는 아래로 내려감).
 */
export default function HeroSection() {
  const [countdown, setCountdown] = useState({ d: "--", h: "--", m: "--" });

  /* 다음 대회까지 남은 일/시/분을 매 30초마다 갱신한다. */
  const update = useCallback(() => {
    const target = new Date(BI_COUNTDOWN_ISO).getTime();
    const diff = target - Date.now();
    if (diff <= 0) {
      setCountdown({ d: "00", h: "00", m: "00" });
      return;
    }
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    setCountdown({
      d: String(d).padStart(2, "0"),
      h: String(h).padStart(2, "0"),
      m: String(m).padStart(2, "0"),
    });
  }, []);

  useEffect(() => {
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [update]);

  return (
    <section className="hero" aria-label="메인 히어로">
      <div className="hero-grid" aria-hidden="true" />

      {/* 탄도 트레이스 — 클럽 임팩트 지점에서 그린 액센트로 떠오르는 궤적 */}
      <svg
        className="hero-trace"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="kld-hero-trace" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M -40 820 Q 380 560 760 480 Q 1040 420 1340 280 Q 1460 220 1520 200"
          stroke="url(#kld-hero-trace)"
          strokeWidth={2}
          fill="none"
        />
        <circle
          cx={1340}
          cy={280}
          r={9}
          fill="none"
          stroke="var(--accent)"
          strokeOpacity={0.5}
        />
        <circle cx={1340} cy={280} r={3} fill="var(--accent)" />
      </svg>

      {/* 배경 숫자 — 올해 최장 비거리 기록 432 YDS */}
      <div className="hero-backdigit" aria-hidden="true">
        432
      </div>

      <div className="wrap hero-inner">
        <div className="hero-eyebrow">
          <span>KOREA LONG DRIVE ASSOCIATION</span>
          <span className="kr">/ 한국장타협회</span>
        </div>

        <h1 className="hero-title">
          GO
          <br />
          <em>
            LONG
            <span className="period" />
          </em>
        </h1>

        <p className="hero-lede">
          Korea&apos;s first official long-drive championship
          <span className="kr">대한민국 최초 공식 롱 드라이브 챔피언십</span>
        </p>

        <div className="hero-cta">
          <Link href="/apply" className="btn btn-primary btn-lg">
            ENTER THE FIELD <span className="arrow">→</span>
          </Link>
          <Link href="/media" className="btn btn-secondary btn-lg">
            WATCH TRAILER
          </Link>
        </div>

        <div className="hero-stats">
          {BI_HERO_STATS.map((s) => (
            <div
              key={s.k}
              className={`hero-stat ${s.hi ? "is-hi" : ""}`}
            >
              <div className="k">{s.k}</div>
              <div className="v">
                {s.v}
                {s.u ? <sub>{s.u}</sub> : null}
              </div>
            </div>
          ))}
        </div>

        {/* 다음 대회 카운트다운 카드 */}
        <aside
          className="hero-countdown"
          aria-label="다음 대회 카운트다운 · Next event countdown"
        >
          <div className="cd-head">
            <span className="cd-tag">
              <span className="cd-dot" aria-hidden="true" />
              NEXT EVENT · 다음 대회
            </span>
            <span className="cd-name">FLEX × KLD · 2025.06.29</span>
          </div>
          <div className="cd-cells">
            <div className="cd-cell">
              <div className="num">{countdown.d}</div>
              <div className="u">Days · 일</div>
            </div>
            <div className="cd-cell">
              <div className="num">{countdown.h}</div>
              <div className="u">Hrs · 시</div>
            </div>
            <div className="cd-cell">
              <div className="num">{countdown.m}</div>
              <div className="u">Min · 분</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
