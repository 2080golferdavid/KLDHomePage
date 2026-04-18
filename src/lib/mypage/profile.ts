import type { PlayerProfile } from "@/types";

/* ══════════════════════════════════════════
   마이페이지 프로필 편집 액션 계층(Action Layer)

   Step 5(회원가입)와 마찬가지로 Supabase 호출을 한 곳에 모아둔 어댑터.
   라이브러리 설치 전까지는 스텁(stub)으로 동작한다.

   실제 연결 시점:
   1) `npm i @supabase/supabase-js`
   2) `src/lib/supabase/client.ts` 로 supabase 클라이언트 생성
   3) 각 함수의 "TODO" 블록을 주석에 적힌 실제 호출로 교체
══════════════════════════════════════════ */

/** 네트워크 지연을 흉내 내는 스텁 헬퍼 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ActionResult {
  success: boolean;
  /** 사용자에게 보여줄 한국어 에러 메시지 */
  error?: string;
}

export interface UploadPhotoResult extends ActionResult {
  /** 성공 시 프로필 사진의 공개 URL(또는 스텁에서는 dataURL) */
  photoUrl?: string;
}

/**
 * 프로필 사진 업로드 → Supabase Storage 버킷 `player-photos` 에 저장.
 * 성공 시 공개 URL 을 반환해, 호출자는 이 값을 players.photo_url 에 저장하면 된다.
 *
 * 실제 구현:
 *   const path = `${userId}/${Date.now()}-${file.name}`;
 *   const { error: upErr } = await supabase.storage
 *     .from('player-photos')
 *     .upload(path, file, { upsert: true, cacheControl: '3600' });
 *   if (upErr) return { success: false, error: upErr.message };
 *
 *   const { data } = supabase.storage.from('player-photos').getPublicUrl(path);
 *   return { success: true, photoUrl: data.publicUrl };
 *
 * ※ 사전 준비: 대시보드 → Storage → 버킷 `player-photos` 생성(공개 설정).
 *   RLS 정책으로 "본인 userId 접두사 경로만 write 허용"을 권장한다.
 */
export async function uploadPlayerPhoto(
  userId: string,
  file: File,
): Promise<UploadPhotoResult> {
  // TODO: Supabase 연결 시 교체.
  await delay(700);

  const MAX_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return {
      success: false,
      error: "이미지 크기는 5MB 이하여야 합니다.",
    };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "이미지 파일만 업로드할 수 있습니다." };
  }

  /* 스텁: 실제 업로드 대신 FileReader 로 dataURL 을 만들어 미리보기에 사용.
     실제 Supabase 연결 시에는 위 주석의 코드로 교체한다. */
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[스텁] 사진 업로드", { userId, name: file.name });
  }
  return { success: true, photoUrl: dataUrl };
}

/** 마이페이지에서 편집 가능한 필드 — 요청 사항과 일치 */
export interface EditablePlayerFields {
  photoUrl?: string;
  bio: string;
  division: PlayerProfile["division"];
  region: string;
  equipment: PlayerProfile["equipment"];
  social: PlayerProfile["social"];
}

/**
 * 편집된 프로필을 저장.
 * - public.players 의 photo_url, bio, region, division, equipment 업데이트
 * - 소셜 링크는 본 프로젝트 구조에서 JSONB 컬럼으로 두거나 users 테이블에
 *   분리할 수 있다. 본 스텁에서는 equipment 와 마찬가지로 JSON 필드로 간주한다.
 *
 * 실제 구현:
 *   const { error } = await supabase
 *     .from('players')
 *     .update({
 *       photo_url: fields.photoUrl ?? null,
 *       bio: fields.bio,
 *       region: fields.region,
 *       division: fields.division,
 *       equipment: fields.equipment,
 *       social: fields.social ?? null,
 *     })
 *     .eq('user_id', userId);
 *   if (error) return { success: false, error: error.message };
 *   return { success: true };
 */
export async function updatePlayerProfile(
  userId: string,
  fields: EditablePlayerFields,
): Promise<ActionResult> {
  // TODO: Supabase 연결 시 교체.
  await delay(600);

  if (!fields.region.trim()) {
    return { success: false, error: "지역을 입력해주세요." };
  }
  if (fields.equipment.some((e) => !e.brand.trim() || !e.model.trim())) {
    return {
      success: false,
      error: "장비 항목에는 브랜드와 모델명이 모두 필요합니다.",
    };
  }

  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[스텁] 프로필 업데이트", { userId, fields });
  }
  return { success: true };
}
