import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "MEDIA — KLD 미디어 아카이브",
  description:
    "KLD 2025 시즌 대회 하이라이트, 선수 인터뷰, 현장 포토를 한곳에서 확인하세요.",
};

const ITEMS = Array.from({ length: 6 }, (_, i) => i + 1);

export default function MediaPage() {
  return (
    <main>
      <PageHero
        secNum="P · 07"
        eyebrow="BROADCAST · 미디어 아카이브"
        titleEn="THE RECORDS"
        titleKr="열정의 기록"
        lead={
          <>
            대회의 박진감 넘치는 하이라이트와 선수들의 땀방울이 담긴 순간들을
            기록합니다.
            <span className="kr">
              Highlights, interviews, and gallery films from every round.
            </span>
          </>
        }
      />

      <section className="sec reveal">
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {ITEMS.map((i) => (
              <article
                key={i}
                style={{
                  cursor: "pointer",
                  border: "1px solid var(--kld-line)",
                  background: "var(--kld-surface-1)",
                  transition: "border-color 160ms var(--kld-ease-snap)",
                }}
              >
                <div
                  style={{
                    aspectRatio: "16 / 9",
                    background:
                      "linear-gradient(135deg, #151820 0%, #0B0B0E 100%)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  aria-hidden="true"
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--kld-font-display)",
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: 48,
                      letterSpacing: "-0.01em",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(200, 255, 62, 0.2)",
                      textTransform: "uppercase",
                    }}
                  >
                    KLD · {String(i).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      fontFamily: "var(--kld-font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                    }}
                  >
                    HIGHLIGHT · R{String(i).padStart(2, "0")}
                  </div>
                </div>
                <div style={{ padding: "18px 18px 22px" }}>
                  <div
                    className="kld-caption-mono"
                    style={{ color: "var(--kld-fg-3)", marginBottom: 8 }}
                  >
                    2025 · ROUND {String(i).padStart(2, "0")}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--kld-font-sans)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    2025 시즌 {i}라운드 공식 하이라이트 필름
                  </h3>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <button type="button" className="btn btn-secondary">
              LOAD MORE · 더 보기 +
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
