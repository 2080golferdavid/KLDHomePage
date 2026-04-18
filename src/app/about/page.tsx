import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "KLD 소개 — 협회",
    description: "한국 장타 스포츠의 표준, KLD Korea Long Drive Association을 소개합니다.",
};

export default function AboutPage() {
    return (
        <main className="pt-nav">
            <section className="px-5 md:px-8 lg:px-16 pt-16 md:pt-20 lg:pt-24 pb-14 border-b border-kld-red/[0.15] bg-dark">
                <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-4">
                    About KLD
                </div>
                <h1 className="font-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-[0.02em] text-white-kld mb-5">
                    가장 멀리, 가장 뜨겁게
                </h1>
                <p className="max-w-[640px] text-[15px] font-light leading-[1.8] text-gray-light">
                    KLD(Korea Long Drive Association)는 대한민국 장타 스포츠의 활성화와 글로벌 경쟁력 강화를 위해 설립되었습니다.
                    아마추어부터 프로까지 모두가 즐길 수 있는 체계적인 대회 시스템을 구축하고,
                    새로운 골프 문화의 패러다임을 제시합니다.
                </p>
            </section>

            <section className="px-5 md:px-8 lg:px-16 py-14 md:py-20 lg:py-24 bg-dark">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                    <div>
                        <h2 className="font-display text-3xl text-white-kld mb-6 tracking-tight">Our Vision</h2>
                        <p className="text-gray-mid leading-[1.7] text-[14px]">
                            단순한 비거리를 넘어, 한계를 극복하는 선수들의 열정과 기술을 조명합니다.
                            KLD는 공정하고 체계적인 랭킹 시스템을 통해 대한민국을 대표하는 장타 챔피언을 탄생시킵니다.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-display text-3xl text-white-kld mb-6 tracking-tight">Divisions</h2>
                        <ul className="space-y-3">
                            {[
                                { name: "아마추어 (Amateur)", desc: "누구나 도전할 수 있는 장타의 입문 관문" },
                                { name: "마스터즈 (Masters)", desc: "숙련된 기술과 구력을 갖춘 베테랑 리그" },
                                { name: "우먼스 (Womens)", desc: "여성 선수들의 압도적인 파워와 스피드" },
                                { name: "오픈 (Open)", desc: "대한민국 최강의 비거리를 가리는 무제한급 리그" },
                            ].map((div) => (
                                <li key={div.name} className="border-l-2 border-kld-red/30 pl-4 py-1">
                                    <div className="text-white-kld font-medium text-sm">{div.name}</div>
                                    <div className="text-gray-mid text-xs mt-1">{div.desc}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
}
