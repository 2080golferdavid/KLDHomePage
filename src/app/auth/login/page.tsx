"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithEmailPassword } from "@/lib/auth/login";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await loginWithEmailPassword(email, password);
        setLoading(false);

        if (result.success) {
            router.push("/");
            router.refresh();
        } else {
            setError(result.error ?? "로그인에 실패했습니다.");
        }
    }

    return (
        <main className="pt-nav bg-dark min-h-screen">
            <section className="mx-auto w-full max-w-[440px] px-5 md:px-8 pt-20 pb-24">
                <header className="text-center mb-10">
                    <div className="font-mono text-[10px] tracking-[0.26em] text-kld-red uppercase mb-3">
                        KLD Login
                    </div>
                    <h1 className="font-display text-[42px] leading-[1] tracking-[0.02em] text-white-kld">
                        로그인
                    </h1>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="email"
                            className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase"
                        >
                            이메일
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@kld.com"
                            required
                            className="w-full bg-dark-200 border border-kld-red/20 px-4 py-3 text-sm text-white-kld focus:border-kld-red focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="password"
                            className="font-mono text-[10px] tracking-[0.2em] text-gray-mid uppercase"
                        >
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-dark-200 border border-kld-red/20 px-4 py-3 text-sm text-white-kld focus:border-kld-red focus:outline-none transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="text-[#FF6060] font-mono text-[11px] bg-[#FF6060]/10 border border-[#FF6060]/20 px-3 py-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-kld-red text-white-kld py-4 font-ui font-bold tracking-[0.2em] uppercase hover:bg-kld-red-light transition-colors disabled:opacity-50"
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>

                    <footer className="mt-8 text-center flex flex-col gap-3">
                        <Link
                            href="/auth/register"
                            className="text-gray-mid text-[12px] hover:text-white-kld transition-colors"
                        >
                            계정이 없으신가요? <span className="text-kld-red">가입하기</span>
                        </Link>
                        <Link
                            href="/"
                            className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-dark hover:text-gray-mid transition-colors"
                        >
                            Back to Home
                        </Link>
                    </footer>
                </form>
            </section>
        </main>
    );
}
