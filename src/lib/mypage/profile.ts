import type { PlayerProfile } from "@/types";

/* ══════════════════════════════════════════
   마이페이지 프로필 편집 액션 계층(Action Layer)

   Supabase 호출을 한 곳에 모아둔 어댑터.
   라이브러리 설치 전까지는 스텁(stub)으로 동작한다.

   실제 연결 시점:
   1) `npm i @supabase/supabase-js`
   2) `src/lib/supabase/client.ts` 로 supabase 클라이언트 생성
   3) 각 함수의 "TODO" 블록을 주석에 적힌 실제 호출로 교체

   참고(RLS):
   - schema.sql 의 players_update_self_or_admin 정책이 본인 row 만 수정을 허용.
   - users.name 을 업데이트할 때도 본인 id 가 일치해야 한다.
   - 아래 "편집 가능" 필드 외의 컬럼(대회 기록/랭킹/포인트 등) 은
     일반 회원 정책에서 write 가 차단되어야 한다(운영 배포 시 정책 검토 필요).
══════════════════════════════════════════ */

/** 네트워크 지연 스텁 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

export interface UploadPhotoResult extends ActionResult {
  /** 성공 시 프로필 사진의 공개 URL(또는 스텁에서는 dataURL) */
  photoUrl?: string;
}

/**
 * 프로필 사진 업로드 → Supabase Storage 버킷 `avatars` 에 저장.
 *
 * 실제 구현:
 *   const path = `${userId}/${Date.now()}-${file.name}`;
 *   const { error: upErr } = await supabase.storage
 *     .from('avatars')
 *     .upload(path, file, { upsert: true, cacheControl: '3600' });
 *   if (upErr) return { success: false, error: upErr.message };
 *
 *   const { data } = supabase.storage.from('avatars').getPublicUrl(path);
 *   return { success: true, photoUrl: data.publicUrl };
 *
 * ※ 사전 준비:
 *   - Storage → 버킷 `avatars` 생성(public)
 *   - RLS: (storage.foldername(name))[1] = auth.uid()::text 로 본인 경로만 write
 */
export async function uploadPlayerPhoto(
  userId: string,
  file: File,
): Promise<UploadPhotoResult> {
  // TODO: Supabase 연결 시 교체.
  await delay(700);

  const MAX_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return { success: false, error: "이미지 크기는 5MB 이하여야 합니다." };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "이미지 파일만 업로드할 수 있습니다." };
  }

  /* 스텁: 실제 업로드 대신 FileReader 로 dataURL 을 만들어 미리보기에 사용. */
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

/** 마이페이지에서 정회원이 편집 가능한 필드 */
export interface EditablePlayerFields {
  /** public.users.name — 한글/영문 */
  name: string;
  photoUrl?: string;
  /** 소속(팀/클럽명) */
  affiliation?: string;
  bio: string;
  /** 디비전은 현재 수정 가능이지만, 요구에 따라 읽기전용으로 전환 가능.
     (마이페이지 2.0 요구사항: 디비전은 수정 불가 — 폼에서 제외하고 이 필드는 유지) */
  division: PlayerProfile["division"];
  region: string;
  equipment: PlayerProfile["equipment"];
  social: PlayerProfile["social"];
}

/**
 * 편집된 프로필을 저장.
 * - public.users.name 업데이트
 * - public.players 의 photo_url, bio, region, division, equipment, social 업데이트
 *
 * 실제 구현:
 *   const [{ error: userErr }, { error: playerErr }] = await Promise.all([
 *     supabase.from('users').update({ name: fields.name }).eq('id', userId),
 *     supabase.from('players').update({
 *       photo_url: fields.photoUrl ?? null,
 *       bio: fields.bio,
 *       region: fields.region,
 *       division: fields.division,
 *       equipment: fields.equipment,
 *       social: fields.social ?? null,
 *     }).eq('user_id', userId),
 *   ]);
 *   if (userErr || playerErr) return { success: false, error: ... };
 *   return { success: true };
 */
export async function updatePlayerProfile(
  userId: string,
  fields: EditablePlayerFields,
): Promise<ActionResult> {
  // TODO: Supabase 연결 시 교체.
  await delay(600);

  if (!fields.name.trim()) {
    return { success: false, error: "이름을 입력해주세요." };
  }
  if (fields.bio.length > 500) {
    return {
      success: false,
      error: "자기소개는 500자 이내여야 합니다.",
    };
  }
  if (!fields.region.trim()) {
    return { success: false, error: "지역을 입력해주세요." };
  }

  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[스텁] 프로필 업데이트", { userId, fields });
  }
  return { success: true };
}
