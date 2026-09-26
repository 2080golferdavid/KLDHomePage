# 한국장타협회 (KLD) 홈페이지

협회를 소개하는 첫 버전입니다. 대회 신청, 회원 가입, 결제는 없습니다.

지금 열리는 페이지는 여섯 가지입니다.

- 홈
- 협회 소개 (`/about`)
- 회장 인사말 (`/about/greeting`)
- 임원진 (`/about/officials`, 예전 `/officials` 주소는 여기로 이동합니다)
- 협회 소식
- 연락·문의
- 개인정보처리방침, 이용약관

글, 로고, 임원, 소식, 연락처는 관리자 화면에서 고칠 수 있습니다. 공개 바닥글에는 관리자 주소가 없습니다.

## 왜 Payload가 아닌가

원하던 구성은 Next.js + Payload CMS + Postgres 입니다. 이 저장소는 Next.js 14 이고, Payload 3 은 Next.js 15 와 빌드 때의 데이터베이스 연결을 필요로 합니다. 비밀 키 없이 `npm run build` 가 되어야 해서, 이번 버전은 그 길을 쓰지 않았습니다.

대신 글의 모양은 Payload 로 옮기기 쉽게 나뉘어 있습니다. Supabase 표 `cms_collections` 의 `key` 가 나중에 컬렉션 이름이 됩니다.

| key | 나중에 Payload 에서 |
| --- | --- |
| settings | 글로벌: 이름, 슬로건, 로고, 파비콘, 첫 화면, SNS |
| about | 글로벌: 소개 |
| greeting | 글로벌: 회장 인사말 |
| officials | 컬렉션: 임원 |
| news | 컬렉션: 소식 |
| contact | 글로벌: 연락처 |
| legal | 개인정보처리방침, 이용약관 |
| inquiries | 컬렉션: 문의 |
| players | 2단계 선수. 지금은 빈 칸 |
| events | 2단계 대회. 참가 신청은 아직 없음 |

## 저장소가 고르는 순서

1. `NEXT_PUBLIC_SUPABASE_URL` 과 `SUPABASE_SERVICE_ROLE_KEY` 가 있으면 Supabase 에 저장합니다.
2. 그 값이 없고, Vercel 이 아니면 이 컴퓨터의 `.data/site-content.json` 에 저장합니다.
3. Vercel 인데 Supabase 가 없으면 코드 안의 기본 글만 보여 주고, 저장은 되지 않습니다.

`CONTENT_STORE=file`, `supabase`, `seed` 로 이 선택을 강제로 바꿀 수 있습니다.

## 실행 방법

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.

`.env.local` 이 비어 있어도 홈은 열립니다. 관리자에 들어가려면 아래 두 줄을 채우고 서버를 다시 실행합니다.

```bash
ADMIN_PASSWORD=원하는-비밀번호
ADMIN_SESSION_SECRET=긴-아무-문장
```

관리자 주소는 http://localhost:3000/admin 입니다. 공개 메뉴에는 없습니다.

## Supabase에 저장하기

1. Supabase 프로젝트를 만듭니다. Postgres 라면 Neon 같은 곳에 둔 Payload 와 달리, 이번 버전은 Supabase 의 Postgres 를 씁니다.
2. SQL Editor 에서 `supabase/cms.sql` 전체를 실행합니다.
3. `.env.local` 에 주소를 넣습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://프로젝트.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` 는 서버만 씁니다. `NEXT_PUBLIC_` 을 붙이면 안 됩니다. 방문자 키만으로는 글이 저장되지 않습니다.

Vercel 프로젝트 설정에도 같은 변수 이름을 넣습니다. 넣은 뒤 다시 배포하면 관리자에서 고친 로고와 소식이 공개 사이트에 보입니다.

`supabase/schema.sql` 은 회원, 대회, 결제 코드용 2단계 설계입니다. 이번 홈페이지에는 필요 없습니다.

## 관리자에서 할 수 있는 일

- 로고, 파비콘, 첫 화면 그림 바꾸기
- 협회 이름, 슬로건, 바닥글, SNS
- 소개 글, 가치, 연혁
- 회장 인사말 (제목, 본문, 이름, 직함, 사진)
- 임원 추가, 수정, 숨기기
- 소식 작성, 공개, 삭제
- 연락처
- 개인정보처리방침, 이용약관
- 문의함에 들어온 글 보기

로고를 비우면 기본 `KLD.` 마크가 나옵니다. 파일을 올리면 그 그림으로 바뀝니다. 파일은 450KB 보다 작아야 합니다.

## 공개 화면의 안내 문구

공개 페이지에는 ‘아직 초안이다’는 배너나 배지를 두지 않습니다. 데이터 칸에 예전 표시가 남아 있어도 방문자에게는 보이지 않습니다. 문장, 사람, 연락처는 관리자 화면에서 고칩니다.

## 2단계에서 열 것

이번 메뉴에 없는 것입니다.

- 선수 소개 (`players`)
- 대회 일정과 결과 (`events`)
- 참가 신청
- 멤버십, 마이 페이지
- 결제

공개 주소를 없앴고, 신청 폼과 결제 버튼도 없습니다. 나중에 선수와 대회를 더할 때는 새 사이트를 처음부터 만들지 않고, 비어 있는 `players` 와 `events` 칸과 `supabase/schema.sql` 의 회원 표를 이어서 쓰면 됩니다.

## 스크립트

```bash
npm run dev
npm run build
npm run start
npm run lint
```
