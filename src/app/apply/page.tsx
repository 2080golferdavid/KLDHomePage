import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "대회 참가 신청 — KLD",
    description: "KLD 2025 정규 시즌 대회 참가 신청 페이지입니다.",
};

export default function ApplyPage() {
    return (
        <main className="pt-nav">
            <section className="px-5 md:px-8 lg:px-16 pt-16 md:pt-20 lg:pt-24 pb-14 border-b border-kld-red/[0.15] bg-dark">
                <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-4">
                    Registration
                </div>
                <h1 className="font-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-[0.02em] text-white-kld mb-5">
                    챔피언을 향한 도전
                </h1>
                <p className="max-w-[560px] text-[15px] font-light leading-[1.8] text-gray-light">
                    대한민국 최고의 장타 무대에 도전하세요.
                    디비전을 선택하고 간단한 신청서 작성을 통해 대회 참가가 가능합니다.
                </p>
            </section>

            <section className="px-5 md:px-8 lg:px-16 py-14 md:py-20 lg:py-24 bg-dark">
                <div className="max-w-[800px] mx-auto">
                    {/* 신청 단계 안내 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                        {[
                            { step: "01", title: "준비", active: true },
                            { step: "02", title: "디비전 선택", active: false },
                            { step: "03", title: "신청서 작성", active: false },
                        ].map((s) => (
                            <div key={s.step} className={`p-6 border ${s.active ? "border-kld-red bg-kld-red/5" : "border-white/10 opacity-40"} flex items-center gap-4`}>
                                <span className={`font-display text-2xl ${s.active ? "text-kld-red" : "text-gray-mid"}`}>{s.step}</span>
                                <span className="font-ui text-sm font-semibold tracking-widest uppercase text-white-kld">{s.title}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-dark-200 border border-white/5 p-8 md:p-12 text-center">
                        <h2 className="font-display text-2xl text-white-kld mb-4">현재 접수 중인 대회가 있습니다</h2>
                        <p className="text-gray-mid text-sm mb-8">
                            플렉스골프라운지 × KLD 장타대회 (2025.06.29)
                        </p>
                        <button className="bg-kld-red text-white-kld px-10 py-4 font-ui font-bold tracking-[0.2em] uppercase hover:bg-kld-red-light transition-colors">
                            신청 시작하기 &rarr;
                        </button>
                    </div>

                    <div className="mt-12">
                        <h3 className="text-white-kld font-semibold text-sm mb-4">신청 시 주의사항</h3>
                        <ul className="space-y-2 text-gray-mid text-[13px] leading-relaxed">
                            <li>• 모든 선수는 본인의 디비전 참가 자격을 확인해야 합니다.</li>
                            <li>• 대회 참가비는 마스터즈/오픈 기준 100,000원입니다.</li>
                            <li>• 참가는 신청서 작성 및 입금 확인 순으로 선착순 마감됩니다.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
}
