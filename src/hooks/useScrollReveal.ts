"use client";

import { useEffect } from "react";

/**
 * 스크롤 시 `.reveal` 클래스를 가진 요소에 `.visible` 클래스를 추가하는 훅
 * IntersectionObserver를 사용하여 요소가 뷰포트에 8% 이상 노출되면 애니메이션을 트리거한다.
 * 한 번 노출된 요소는 다시 관찰하지 않는다(fire once).
 */
export function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
