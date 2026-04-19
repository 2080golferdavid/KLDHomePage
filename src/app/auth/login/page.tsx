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
    <main style={{ minHeight: "100vh", paddingTop: 140, paddingBottom: 96 }}>
      <div className="wrap" style={{ maxWidth: 480 }}>
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="sec-eyebrow" style={{ justifyContent: "center" }}>
            SIGN IN · 로그인
          </div>
          <h1
            className="sec-title"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            LOG IN<span className="kr">다시 오신 것을 환영합니다</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-row">
            <label htmlFor="email" className="form-label">
              EMAIL · 이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@kld.com"
              required
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-row">
            <label htmlFor="password" className="form-label">
              PASSWORD · 비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div
              role="alert"
              style={{
                background: "rgba(255, 96, 96, 0.08)",
                border: "1px solid rgba(255, 96, 96, 0.4)",
                color: "#FF6060",
                padding: "10px 12px",
                fontFamily: "var(--kld-font-mono)",
                fontSize: 11,
                marginBottom: 16,
                letterSpacing: "0.04em",
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: 8 }}
          >
            {loading ? "SIGNING IN..." : "LOG IN · 로그인"}
          </button>

          <footer
            style={{
              marginTop: 28,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <Link
              href="/auth/register"
              style={{
                fontFamily: "var(--kld-font-sans)",
                fontSize: 13,
                color: "var(--kld-fg-2)",
              }}
            >
              계정이 없으신가요?{" "}
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                JOIN · 가입하기
              </span>
            </Link>
            <Link
              href="/"
              className="kld-caption-mono"
              style={{ color: "var(--kld-fg-4)" }}
            >
              BACK TO HOME · 홈으로
            </Link>
          </footer>
        </form>
      </div>
    </main>
  );
}
