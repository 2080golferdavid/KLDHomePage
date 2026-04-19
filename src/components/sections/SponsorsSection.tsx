import { BI_SPONSORS } from "@/constants/homeData";

/**
 * 후원사 섹션.
 * 6개 열 그리드로 브랜드명을 이탤릭 디스플레이 폰트로 배치한다.
 * 후원사 이미지 로고가 준비되기 전까지는 텍스트 플레이스홀더를 사용.
 */
export default function SponsorsSection() {
  return (
    <section className="sec reveal" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="wrap">
        <div
          className="sec-eyebrow"
          style={{ justifyContent: "center", textAlign: "center" }}
        >
          POWERED BY · 공식 후원사
        </div>
        <div className="sponsors" style={{ marginTop: 32 }}>
          {BI_SPONSORS.map((s, i) => (
            <div key={`${s}-${i}`} className="sponsor">
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
