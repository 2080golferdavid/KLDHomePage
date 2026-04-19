import Image from "next/image";
import { BI_FOOTER_COLS } from "@/constants/homeData";

/**
 * 사이트 하단 푸터(Footer)
 * 레퍼런스의 broadcast 스타일 푸터 — 브랜드 로고 + 태그라인 + 3열 링크 + 소셜 + 저작권.
 */
export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-logo brand-logo-footer">
              <Image
                src="/images/LOGO3.png"
                alt="KLD · Korea Long Drive"
                fill
                sizes="240px"
              />
            </span>
            <p className="footer-tag">
              한국 장타 스포츠의 표준을 세우는
              <br />
              Korea Long Drive Association.
              <span className="kr">GO LONG.</span>
            </p>
            <div className="social" aria-label="소셜 미디어 · Social">
              <a href="#" aria-label="YouTube">
                ▶
              </a>
              <a href="#" aria-label="Instagram">
                ◎
              </a>
              <a href="#" aria-label="Kakao">
                ✦
              </a>
              <a href="#" aria-label="X">
                ✕
              </a>
            </div>
          </div>

          <div className="footer-cols">
            {BI_FOOTER_COLS.map((group) => (
              <div key={group.h} className="footer-col">
                <h4>{group.h}</h4>
                {group.links.map((label) => (
                  <a key={label} href="#">
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="footer-base">
          <div>© 2026 KOREA LONG DRIVE ASSOCIATION · ALL RIGHTS RESERVED</div>
          <div>대표: 박경현 · kld2024@naver.com · 010-9916-8117</div>
        </div>
      </div>
    </footer>
  );
}
