import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "미디어 하이라이트 — KLD",
    description: "KLD 2025 시즌 대회 하이라이트, 선수 인터뷰 및 현장 포토를 확인하세요.",
};

export default function MediaPage() {
    return (
        <main className="pt-nav">
            <section className="px-5 md:px-8 lg:px-16 pt-16 md:pt-20 lg:pt-24 pb-14 border-b border-kld-red/[0.15] bg-dark">
                <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-4">
                    Media Archive
                </div>
                <h1 className="font-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-[0.02em] text-white-kld mb-5">
                    열정의 기록
                </h1>
                <p className="max-w-[560px] text-[15px] font-light leading-[1.8] text-gray-light">
                    대회의 박진감 넘치는 하이라이트와 선수들의 땀방울이 담긴 순간들을 기록합니다.
                    최신 영상부터 고화질 갤러리까지, 장타의 매력을 느껴보세요.
                </p>
            </section>

            <section className="px-5 md:px-8 lg:px-16 py-14 md:py-20 lg:py-24 bg-dark">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Placeholder for media items */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-video bg-dark-200 border border-white/10 overflow-hidden relative mb-4 transition-colors group-hover:border-kld-red/50">
                                <div className="absolute inset-0 flex items-center justify-center text-kld-red/20 font-display text-4xl select-none">
                                    KLD MEDIA {i}
                                </div>
                                {/* Overlay for hover state */}
                                <div className="absolute inset-0 bg-kld-red/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="font-mono text-[9px] tracking-[0.18em] text-kld-red uppercase mb-2">
                                Highlight · 2025 Round 0{i}
                            </div>
                            <h3 className="text-white-kld font-medium text-sm transition-colors group-hover:text-kld-red">
                                2025 시즌 {i}라운드 공식 하이라이트 필름
                            </h3>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="font-mono text-[11px] tracking-[0.2em] uppercase text-gray-mid border border-white/10 px-8 py-3 hover:text-white-kld hover:border-white/30 transition-all">
                        Load More +
                    </button>
                </div>
            </section>
        </main>
    );
}
