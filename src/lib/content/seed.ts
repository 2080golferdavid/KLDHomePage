import type { SiteDocument } from "@/lib/content/types";

const STAMP = "2026-09-01T00:00:00.000Z";

/**
 * 저장소가 비어 있을 때 쓰는 기본 글.
 * 사람 이름과 연락처는 관리자 화면에서 바꿀 수 있다.
 */
export function createSeed(): SiteDocument {
  return {
    settings: {
      siteName: "한국장타협회",
      siteNameEn: "KOREA LONG DRIVE ASSOCIATION",
      slogan: "비거리를 넘어, 위대함을 향해.",
      oneLiner: "한국장타협회(KLD)는 롱드라이브의 기록과 사람을 잇는 협회입니다.",
      heroEyebrow: "KOREA LONG DRIVE ASSOCIATION",
      heroTitle: "비거리를 넘어,\n위대함을 향해.",
      heroBody:
        "한 번 더 도전하는 용기, 서로의 기록을 응원하는 마음. 한국장타협회는 대회와 기록, 사람을 연결하며 한국 장타 스포츠의 다음 장을 함께 만들어 갑니다.",
      heroImageUrl: "",
      logoUrl: "",
      faviconUrl: "",
      footerNote: "한국장타협회는 롱드라이브 문화를 알리는 단체입니다.",
      disclaimer: "",
      sns: [],
      updatedAt: STAMP,
    },
    about: {
      eyebrow: "KOREA LONG DRIVE ASSOCIATION",
      title: "비거리를 넘어,\n위대함을 향해.",
      intro:
        "한 번 더 도전하는 용기, 서로의 기록을 응원하는 마음. 한국장타협회는 대회와 기록, 사람을 연결하며 한국 장타 스포츠의 다음 장을 함께 만들어 갑니다.",
      missionTitle: "우리가 서 있는 이유",
      missionBody:
        "멀리 보내는 힘만 자랑하지 않습니다. 기록이 공정하게 남고, 선수와 팬이 오래 만날 수 있는 자리를 만드는 일이 협회의 일입니다.",
      values: [
        {
          number: "01",
          title: "도전",
          body: "자신의 한계를 향해 끊임없이 도전하는 골퍼들의 무대.",
        },
        {
          number: "02",
          title: "기록",
          body: "한 번의 스윙부터 대회의 결과까지, 도전의 순간을 기록합니다.",
        },
        {
          number: "03",
          title: "함께",
          body: "같은 열정으로 모여 서로의 성장을 응원합니다.",
        },
      ],
      history: [],
      updatedAt: STAMP,
    },
    greeting: {
      title: "회장 인사말",
      body: "",
      name: "",
      role: "",
      photoUrl: "",
      updatedAt: STAMP,
    },
    officials: [
      {
        id: "official-example-kim",
        name: "김예시",
        nameEn: "",
        role: "협회장",
        bio: "협회를 대표하는 자리입니다.",
        photoUrl: "",
        sort: 1,
        published: false,
        isExample: false,
      },
      {
        id: "official-example-lee",
        name: "이임시",
        nameEn: "",
        role: "사무국장",
        bio: "일정, 공지, 문의 답을 맡는 자리입니다.",
        photoUrl: "",
        sort: 2,
        published: false,
        isExample: false,
      },
      {
        id: "official-example-park",
        name: "박샘플",
        nameEn: "",
        role: "경기위원장",
        bio: "경기 진행과 기록 규칙을 살피는 자리입니다.",
        photoUrl: "",
        sort: 3,
        published: false,
        isExample: false,
      },
    ],
    news: [
      {
        id: "news-hello",
        slug: "association-hello",
        title: "한국장타협회 소개 페이지를 열었습니다",
        excerpt: "협회의 이야기, 임원, 소식을 한곳에 모으기 시작했습니다. 대회 신청은 아직입니다.",
        body: "안녕하세요. 한국장타협회입니다.\n\n지금은 협회를 알리는 일에 집중합니다. 선수 등록, 대회 일정, 참가 신청, 회비 결제는 다음 단계에서 열 예정입니다.",
        category: "안내",
        publishedAt: "2026-09-18T09:00:00.000Z",
        published: false,
        isExample: false,
      },
      {
        id: "news-contact",
        slug: "how-to-reach-kld",
        title: "문의는 메일로 받을 준비를 하고 있습니다",
        excerpt: "문의 폼에 남긴 글은 관리자 화면에 모입니다.",
        body: "사이트가 Supabase 또는 이 컴퓨터의 저장 파일에 연결되어 있으면, 문의 폼으로 보낸 글이 관리자의 문의함에 쌓입니다.\n\n저장소가 없으면 화면에 적힌 메일로 직접 보내면 됩니다.",
        category: "안내",
        publishedAt: "2026-08-20T09:00:00.000Z",
        published: false,
        isExample: false,
      },
    ],
    contact: {
      email: "",
      phone: "",
      address: "",
      hours: "",
      note: "대회 참가와 회비는 받지 않습니다. 협회의 이야기와 제휴 문의만 남겨 주세요.",
      isExample: false,
      updatedAt: STAMP,
    },
    legal: {
      privacy: {
        title: "개인정보처리방침",
        isDraft: false,
        updatedAt: STAMP,
        body: "문의 폼에 적는 이름, 이메일, 문의 내용은 답변을 위해 받습니다.",
      },
      terms: {
        title: "이용약관",
        isDraft: false,
        updatedAt: STAMP,
        body: "이 사이트는 한국장타협회 소개와 소식, 문의를 위한 페이지입니다. 대회 참가 신청, 회비 결제, 회원 가입, 선수 등록은 하지 않습니다.",
      },
    },
    inquiries: [],
    players: [],
    events: [],
  };
}
