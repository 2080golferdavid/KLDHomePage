import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "ABOUT — KLD 협회 소개",
  description:
    "한국 장타 스포츠의 표준, KLD Korea Long Drive Association 을 소개합니다.",
};

const DIVISIONS = [
  {
    en: "AMATEUR",
    kr: "아마추어",
    desc: "누구나 도전할 수 있는 장타의 입문 관문.",
  },
  {
    en: "MASTERS",
    kr: "마스터즈",
    desc: "숙련된 기술과 구력을 갖춘 베테랑 리그.",
  },
  {
    en: "WOMENS",
    kr: "우먼스",
    desc: "여성 선수들의 압도적인 파워와 스피드.",
  },
  {
    en: "OPEN",
    kr: "오픈",
    desc: "대한민국 최강의 비거리를 가리는 무제한급 리그.",
  },
];

const PILLARS = [
  {
    k: "VISION · 비전",
    title: "GO LONG.",
    body: "단순한 비거리를 넘어, 한계를 극복하는 선수들의 열정과 기술을 조명합니다. KLD는 공정하고 체계적인 랭킹 시스템을 통해 대한민국을 대표하는 장타 챔피언을 탄생시킵니다.",
  },
  {
    k: "MISSION · 미션",
    title: "STANDARDIZE.",
    body: "선수 등록과 대회 운영, 기록 관리의 표준을 수립합니다. 공인 규정과 장비 심사, 데이터 기반 랭킹으로 모든 참가자가 납득할 수 있는 무대를 만듭니다.",
  },
  {
    k: "COMMUNITY · 커뮤니티",
    title: "BUILD THE SCENE.",
    body: "지역 라운지와 파트너 브랜드, 팬과 미디어가 함께 커가는 환경을 만듭니다. 아마추어부터 프로까지, 누구든 장타 씬(scene)에 기여할 수 있게 합니다.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        secNum="P · 01"
        eyebrow="ABOUT KLD · 협회 소개"
        titleEn="GO LONG."
        titleKr="가장 멀리, 가장 뜨겁게"
        lead={
          <>
            KLD(Korea Long Drive Association)는 대한민국 장타 스포츠의 활성화와
            글로벌 경쟁력 강화를 위해 설립되었습니다. 아마추어부터 프로까지
            모두가 도전할 수 있는 체계적인 대회 시스템을 구축합니다.
            <span className="kr">
              Korea&apos;s official long-drive federation — built for fans,
              broadcasters, and athletes alike.
            </span>
          </>
        }
      />

      {/* PILLARS */}
      <section className="sec reveal">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-eyebrow">THREE PILLARS · 세 가지 기둥</div>
              <h2 className="sec-title">
                WHY KLD<span className="kr">협회가 존재하는 이유</span>
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "var(--kld-line)",
              border: "1px solid var(--kld-line)",
            }}
          >
            {PILLARS.map((p) => (
              <div
                key={p.k}
                style={{
                  background: "var(--kld-surface-1)",
                  padding: "36px 28px",
                }}
              >
                <div className="kld-caption-mono" style={{ color: "var(--accent)", marginBottom: 16 }}>
                  {p.k}
                </div>
                <div
                  style={{
                    fontFamily: "var(--kld-font-display)",
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: 36,
                    letterSpacing: "-0.01em",
                    textTransform: "uppercase",
                    color: "#fff",
                    marginBottom: 14,
                    lineHeight: 0.95,
                  }}
                >
                  {p.title}
                </div>
                <p className="kld-caption-kr" style={{ color: "var(--kld-fg-2)" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVISIONS */}
      <section className="sec sec-alt reveal">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-eyebrow">DIVISIONS · 디비전</div>
              <h2 className="sec-title">
                FOUR ARENAS<span className="kr">네 개의 리그</span>
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 1,
              background: "var(--kld-line)",
              border: "1px solid var(--kld-line)",
            }}
          >
            {DIVISIONS.map((d) => (
              <div
                key={d.en}
                style={{
                  background: "var(--kld-surface-1)",
                  padding: "32px 24px",
                  borderLeft: "2px solid var(--accent)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--kld-font-display)",
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: 40,
                    letterSpacing: "-0.01em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    lineHeight: 0.95,
                  }}
                >
                  {d.en}
                </div>
                <div
                  style={{
                    fontFamily: "var(--kld-font-kr)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    marginTop: 8,
                    marginBottom: 14,
                  }}
                >
                  {d.kr}
                </div>
                <p className="kld-caption-kr">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
