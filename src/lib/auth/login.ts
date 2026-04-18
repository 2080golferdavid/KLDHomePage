import { signInAs, signOut } from "@/hooks/useCurrentUser";

/** 네트워크 지연을 흉내 내는 스텁 헬퍼 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface LoginResult {
    success: boolean;
    error?: string;
}

/**
 * 이메일/비밀번호 기반 로그인 (모의 구현)
 *
 * 실제 구현 시:
 *   const { error } = await supabase.auth.signInWithPassword({ email, password });
 *   return { success: !error, error: error?.message };
 */
export async function loginWithEmailPassword(
    email: string,
    password: string,
): Promise<LoginResult> {
    await delay(800);

    // 스텁 밸리데이션
    if (!email.includes("@")) {
        return { success: false, error: "이메일 형식이 올바르지 않습니다." };
    }
    if (password.length < 8) {
        return { success: false, error: "비밀번호는 8자 이상이어야 합니다." };
    }

    // 모의 로그인 처리 (localStorage 세팅)
    // 실제 DB가 없으므로 이메일 앞부분을 ID로 사용한다.
    const userId = email.split("@")[0];
    const isAdmin = email.startsWith("admin");

    if (typeof window !== "undefined") {
        signInAs(userId, isAdmin ? "admin" : null);
    }

    return { success: true };
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
    await delay(300);
    if (typeof window !== "undefined") {
        signOut();
    }
}
