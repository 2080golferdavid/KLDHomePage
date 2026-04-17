"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { COUNTDOWN_EVENT } from "@/constants/siteData";

/**
 * 히어로 섹션 — 메인 비주얼 영역
 * 풀스크린 배경 위에 타이틀, 설명, CTA 버튼, 카운트다운을 표시한다.
 */
export default function HeroSection() {
  const [countdown, setCountdown] = useState({ days: "--", hours: "--", mins: "--" });

  /* 카운트다운 타이머: 다음 대회까지 남은 시간을 매 분 갱신한다. */
  const updateCountdown = useCallback(() => {
    const target = new Date(COUNTDOWN_EVENT.date).getTime();
    const diff = target - Date.now();

    if (diff <= 0) {
      setCountdown({ days: "00", hours: "00", mins: "00" });
      return;
    }

    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const mins = Math.floor((diff % 3_600_000) / 60_000);

    setCountdown({
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      mins: String(mins).padStart(2, "0"),
    });
  }, []);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 60_000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  return (
    <section className="relative h-svh min-h-[640px] flex items-end overflow-hidden px-5 md:px-8 lg:px-16 pb-12 md:pb-[72px] lg:pb-20" aria-label="메인 히어로">
      {/* ── 배경 그래디언트 ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 65% 40%, rgba(196,30,30,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 70% at 80% 70%, rgba(196,30,30,0.05) 0%, transparent 55%),
            linear-gradient(160deg, #0D0808 0%, #080808 50%, #0A0404 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* ── 그리드 패턴 오버레이 ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(196,30,30,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,30,30,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── 스윙 라인 SVG ── */}
      <svg
        className="absolute top-[32%] left-0 right-0 pointer-events-none opacity-30"
        viewBox="0 0 1440 80"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M-20 65 Q300 15 680 28 Q900 35 1100 18 Q1280 8 1460 22"
          stroke="url(#swingGrad)"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="1102" cy="17" r="10" stroke="#C41E1E" strokeWidth="1.5" fill="none" opacity="0.7" />
        <circle cx="1102" cy="17" r="4" fill="#C41E1E" opacity="0.5" />
        <defs>
          <linearGradient id="swingGrad" x1="0" y1="0" x2="1460" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B0000" stopOpacity="0" />
            <stop offset="50%" stopColor="#C41E1E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C41E1E" stopOpacity="0.55" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── 배경 거리 숫자 ── */}
      <div
        className="
          absolute right-[-20px] top-1/2 -translate-y-[52%]
          font-display text-[clamp(100px,22vw,340px)] leading-[0.85]
          text-transparent pointer-events-none select-none tracking-tight
          animate-fade-in
        "
        style={{ WebkitTextStroke: "1px rgba(196,30,30,0.13)" }}
        aria-hidden="true"
      >
        387
      </div>

      {/* ── 시즌 태그 (데스크톱) ── */}
      <div
        className="
          absolute top-[calc(72px+48px)] right-5 md:right-8 lg:right-16
          hidden md:flex flex-col items-end gap-[5px]
          animate-fade-in
        "
        aria-hidden="true"
      >
        <div className="font-mono text-[10px] tracking-[0.18em] text-gray-mid uppercase">
          2025 SEASON
        </div>
        <div className="font-mono text-[10px] tracking-[0.18em] text-gray-mid uppercase">
          ROUND <span className="text-kld-red">03 / 08</span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.18em] text-gray-mid uppercase">
          PARTICIPANTS <span className="text-kld-red">214</span>
        </div>
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div className="relative z-[2] max-w-[680px] animate-fade-in-up">
        {/* 라이브 배지 */}
        <div className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.22em] text-kld-red border border-kld-red/40 px-2.5 py-1 uppercase mb-5">
          <span className="w-[5px] h-[5px] rounded-full bg-kld-red animate-pulse" aria-hidden="true" />
          SEASON ACTIVE
        </div>

        {/* 아이브로 */}
        <div className="font-mono text-[10px] tracking-[0.28em] text-kld-red uppercase flex items-center gap-3 mb-5">
          <span className="w-7 h-px bg-kld-red shrink-0" aria-hidden="true" />
          Korea Long Drive Association
        </div>

        {/* 타이틀 */}
        <h1 className="font-display text-[clamp(56px,9vw,128px)] leading-[0.88] tracking-[0.02em] text-white-kld mb-6">
          LONGEST
          <br />
          <em className="not-italic text-kld-red block">HITTERS</em>
          IN KOREA
        </h1>

        {/* 설명 */}
        <p className="text-[clamp(13px,1.5vw,15px)] font-light leading-[1.75] text-gray-light max-w-[400px] mb-10">
          한국 최고의 장타자들이 모이는 곳.
          <br />
          아마추어부터 오픈까지, KLD가 기록을 만들고 챔피언을 탄생시킵니다.
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Link
            href="/apply"
            className="
              inline-flex items-center justify-center
              font-ui text-[13px] font-bold tracking-[0.22em] uppercase text-white-kld
              bg-kld-red px-9 py-4
              hover:bg-kld-red-light transition-colors
              w-full sm:w-auto
            "
          >
            대회 신청하기
          </Link>
          <Link
            href="/competitions"
            className="
              font-ui text-[13px] font-semibold tracking-[0.18em] uppercase text-gray-light
              flex items-center gap-1.5
              hover:text-white-kld transition-colors
              group
            "
          >
            대회 일정 보기
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* ── 카운트다운 (모바일에서는 콘텐츠 아래에, 데스크톱에서는 우하단 고정) ── */}
        <div
          className="
            mt-8 lg:mt-0
            lg:absolute lg:bottom-20 lg:right-5
            flex flex-wrap items-end gap-2 lg:gap-0
            animate-fade-in-delayed
          "
          aria-label="다음 대회까지"
        >
          <div className="w-full lg:w-auto text-left lg:text-right lg:mr-4">
            <div className="font-mono text-[9px] tracking-[0.18em] text-gray-mid uppercase mb-1">
              NEXT EVENT
            </div>
            <div className="font-ui text-[13px] tracking-[0.08em] text-gray-light">
              {COUNTDOWN_EVENT.name}
            </div>
          </div>
          {[
            { value: countdown.days, label: "DAYS" },
            { value: countdown.hours, label: "HRS" },
            { value: countdown.mins, label: "MIN" },
          ].map((item) => (
            <div
              key={item.label}
              className="
                flex flex-col items-center
                px-3 lg:px-[18px] py-2.5 lg:py-3
                bg-kld-red/[0.07] border border-kld-red/20
                min-w-[58px] lg:min-w-[66px]
              "
            >
              <span className="font-display text-[32px] lg:text-[40px] leading-none text-kld-red">
                {item.value}
              </span>
              <span className="font-mono text-[8px] tracking-[0.2em] text-gray-mid mt-1 uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
