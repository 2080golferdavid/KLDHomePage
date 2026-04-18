import { createClient } from "@supabase/supabase-js";

/**
 * Supabase 브라우저 클라이언트 (Singleton)
 *
 * 모든 data/*.ts, lib/*.ts 의 fetcher 내부에서 이 인스턴스를 import 해 사용한다.
 * 브라우저 번들에 포함되어야 하므로 환경변수는 NEXT_PUBLIC_ 접두사가 필수.
 *
 * .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * 서버 컴포넌트에서 쿠키 기반 세션이 필요해지면 `@supabase/ssr` 의
 * createServerClient 를 별도 파일에 둔다. 현재 프로젝트는 Client Component
 * 위주라 이 파일 하나로 충분하다.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경변수 누락 시 원인을 즉시 알 수 있도록 명시적으로 에러를 던진다.
if (!supabaseUrl) {
  throw new Error(
    "[Supabase] NEXT_PUBLIC_SUPABASE_URL 환경변수가 설정되지 않았습니다. .env.local 을 확인하세요.",
  );
}
if (!supabaseAnonKey) {
  throw new Error(
    "[Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수가 설정되지 않았습니다. .env.local 을 확인하세요.",
  );
}

/** 싱글톤 클라이언트 — 앱 전체에서 하나만 존재한다. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
