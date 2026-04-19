import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "APPLY — 대회 참가 신청 · KLD",
  description: "KLD 2025 정규 시즌 대회 참가 신청 페이지입니다.",
};

const STEPS = [
  { n: "01", t: "PREPARE · 준비", active: true },
  { n: "02", t: "DIVISION · 디비전", active: false },
  { n: "03", t: "FORM · 신청서", active: false },
  { n: "04", t: "PAYMENT · 결제", active: false },
  { n: "05", t: "DONE · 완료", active: false },
];

const NOTES = [
  "모든 선수는 본인의 디비전 참가 자격을 확인해야 합니다.",
  "대회 참가비는 마스터즈/오픈 기준 100,000원입니다.",
  "참가는 신청서 작성 및 입금 확인 순으로 선착순 마감됩니다.",
  "팀전은 개인전 참가자만 신청할 수 있습니다.",
];

export default function ApplyPage() {
  return (
    <main>
      <PageHero
        secNum="P · 02"
        eyebrow="ENTER THE FIELD · 대회 참가 신청"
        titleEn="APPLY NOW"
        titleKr="챔피언을 향한 도전"
        lead={
          <>
            디비전을 선택하고 간단한 신청서 작성으로 대한민국 최고의 장타 무대에
            오를 수 있습니다.
            <span className="kr">
              Five short steps to the tee. 모든 자격 조건은 신청 중 안내됩니다.
            </span>
          </>
        }
      />

      <section className="sec reveal">
        <div className="wrap" style={{ maxWidth: 960 }}>
          {/* STEP 표시 */}
          <div className="stepper" aria-label="신청 단계">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className={`stepper-cell ${s.active ? "is-active" : ""}`}
              >
                <div className="n">{s.n}</div>
                <div className="t">{s.t}</div>
              </div>
            ))}
          </div>

          <article className="form-card" style={{ textAlign: "center" }}>
            <div
              className="kld-caption-mono"
              style={{ color: "var(--accent)", marginBottom: 14 }}
            >
              OPEN FOR REGISTRATION · 접수 중
            </div>
            <h2
              style={{
                fontFamily: "var(--kld-font-display)",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(28px, 3vw, 44px)",
                textTransform: "uppercase",
                color: "#fff",
                margin: "0 0 12px",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              FLEX × KLD LONG DRIVE OPEN
            </h2>
            <p
              style={{
                fontFamily: "var(--kld-font-kr)",
                color: "var(--kld-fg-2)",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              플렉스골프라운지 × KLD 장타대회
            </p>
            <p className="kld-caption-mono">2025.06.29 · SUN · SEOUL</p>

            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                marginTop: 28,
                flexWrap: "wrap",
              }}
            >
              <button type="button" className="btn btn-primary btn-lg">
                신청 시작 · START <span className="arrow">→</span>
              </button>
              <Link href="/competitions" className="btn btn-secondary btn-lg">
                EVENT DETAILS · 대회 안내
              </Link>
            </div>
          </article>

          <article className="panel" style={{ marginTop: 40 }}>
            <div className="panel-head">
              <h3 className="panel-title">
                NOTICE<span className="kr">신청 전 확인사항</span>
              </h3>
              <span className="kld-caption-mono">KLD.RULES / 2025</span>
            </div>
            <ul style={{ display: "grid", gap: 14 }}>
              {NOTES.map((n, i) => (
                <li
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 1fr",
                    gap: 14,
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--kld-font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      color: "var(--accent)",
                      fontWeight: 700,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="kld-caption-kr" style={{ color: "var(--kld-fg-2)" }}>
                    {n}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
