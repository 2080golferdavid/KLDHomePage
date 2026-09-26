import type { SiteDocument } from "@/lib/content/types";

const STAMP = "2026-09-01T00:00:00.000Z";

/**
 * 실제 협회 문장이 생기기 전까지 보여주는 임시 글.
 * 문장과 사람 이름은 모두 예시이다.
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
        "한 번 더 도전하는 용기, 서로의 기록을 응원하는 마음. 한국장타협회는 대회와 기록, 사람을 연결하며 한국 장타 스포츠의 다음 장을 함께 만들어 갑니다. (임시 문구)",
      heroImageUrl: "",
      logoUrl: "",
      faviconUrl: "",
      footerNote: "한국장타협회는 롱드라이브 문화를 알리는 단체입니다.",
      disclaimer:
        "이 사이트의 소개, 임원, 연락처, 소식은 내용을 채우기 위한 예시입니다. 확정된 협회의 공식 발표가 아닙니다.",
      sns: [
        { label: "Instagram (예시)", href: "https://example.com/kld-instagram" },
        { label: "YouTube (예시)", href: "https://example.com/kld-youtube" },
      ],
      updatedAt: STAMP,
    },
    about: {
      eyebrow: "KOREA LONG DRIVE ASSOCIATION",
      title: "비거리를 넘어,\n위대함을 향해.",
      intro:
        "한 번 더 도전하는 용기, 서로의 기록을 응원하는 마음. 한국장타협회는 대회와 기록, 사람을 연결하며 한국 장타 스포츠의 다음 장을 함께 만들어 갑니다.",
      missionTitle: "우리가 서 있는 이유",
      missionBody:
        "멀리 보내는 힘만 자랑하지 않습니다. 기록이 공정하게 남고, 선수와 팬이 오래 만날 수 있는 자리를 만드는 일이 협회의 일입니다. 이 문단은 임시 예시입니다.",
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
      history: [
        {
          year: "2024",
          title: "준비를 시작하다",
          body: "롱드라이브를 좋아하는 사람들이 협회가 할 일을 적어 본 해입니다. 예시입니다.",
          isExample: true,
        },
        {
          year: "2025",
          title: "이름과 방향을 정리하다",
          body: "한국장타협회라는 이름과, 기록과 사람을 잇겠다는 방향을 임시로 적었습니다.",
          isExample: true,
        },
        {
          year: "2026",
          title: "소개 페이지를 열다",
          body: "협회를 알리는 첫 홈페이지를 열었습니다. 대회 신청은 아직 열리지 않았습니다.",
          isExample: true,
        },
      ],
      updatedAt: STAMP,
    },
    officials: [
      {
        id: "official-example-kim",
        name: "김예시",
        nameEn: "EXAMPLE KIM",
        role: "협회장",
        bio: "협회를 대표하는 자리입니다. 실명과 사진이 정해지면 이 카드를 바꾸면 됩니다.",
        photoUrl: "",
        sort: 1,
        published: true,
        isExample: true,
      },
      {
        id: "official-example-lee",
        name: "이임시",
        nameEn: "EXAMPLE LEE",
        role: "사무국장",
        bio: "일정, 공지, 문의 답을 맡는 자리로 적어 둔 예시입니다.",
        photoUrl: "",
        sort: 2,
        published: true,
        isExample: true,
      },
      {
        id: "official-example-park",
        name: "박샘플",
        nameEn: "EXAMPLE PARK",
        role: "경기위원장",
        bio: "경기 진행과 기록 규칙을 살피는 자리로 적어 둔 예시입니다.",
        photoUrl: "",
        sort: 3,
        published: true,
        isExample: true,
      },
    ],
    news: [
      {
        id: "news-hello",
        slug: "association-hello",
        title: "한국장타협회 소개 페이지를 열었습니다",
        excerpt: "협회의 이야기, 임원, 소식을 한곳에 모으기 시작했습니다. 대회 신청은 아직입니다.",
        body: "안녕하세요. 한국장타협회입니다.\n\n이 글은 홈페이지가 어떤 모습인지 보여 주기 위한 예시입니다. 실제 공지가 생기면 관리자 화면에서 이 글을 고치거나 새 글을 올리면 됩니다.\n\n지금은 협회를 알리는 일에 집중합니다. 선수 등록, 대회 일정, 참가 신청, 회비 결제는 다음 단계에서 열 예정입니다.",
        category: "안내",
        publishedAt: "2026-09-18T09:00:00.000Z",
        published: true,
        isExample: true,
      },
      {
        id: "news-officials",
        slug: "officials-are-examples",
        title: "임원 소개는 확정 전 예시입니다",
        excerpt: "이름과 역할은 자리를 보여 주기 위한 임시 카드입니다. 실제 임원이 정해지면 바꿉니다.",
        body: "임원진 페이지의 이름, 영문 표기, 역할은 모두 예시입니다.\n\n사진을 올리면 카드의 큰 글자 대신 사진이 보입니다. 공개하지 않을 사람은 '공개' 표시를 끄면 사이트에서 사라집니다.\n\n이 글도 예시이므로, 실제 인사가 끝나면 지워도 됩니다.",
        category: "협회",
        publishedAt: "2026-09-07T09:00:00.000Z",
        published: true,
        isExample: true,
      },
      {
        id: "news-contact",
        slug: "how-to-reach-kld",
        title: "문의는 메일로 받을 준비를 하고 있습니다",
        excerpt: "연락처는 임시 번호와 임시 메일입니다. 문의 폼에 남긴 글은 관리자 화면에 모입니다.",
        body: "연락 페이지의 주소, 전화, 메일은 아직 예시입니다.\n\n사이트가 Supabase 또는 이 컴퓨터의 저장 파일에 연결되어 있으면, 문의 폼으로 보낸 글이 관리자의 문의함에 쌓입니다.\n\n저장소가 없으면 화면에 적힌 메일로 직접 보내면 됩니다.",
        category: "안내",
        publishedAt: "2026-08-20T09:00:00.000Z",
        published: true,
        isExample: true,
      },
    ],
    contact: {
      email: "hello@example.com",
      phone: "02-0000-0000",
      address: "서울특별시 (상세 주소는 나중에 공개)",
      hours: "평일 10:00–17:00 (임시)",
      note: "대회 참가와 회비는 받지 않습니다. 협회의 이야기와 제휴 문의만 남겨 주세요.",
      isExample: true,
      updatedAt: STAMP,
    },
    legal: {
      privacy: {
        title: "개인정보처리방침",
        isDraft: true,
        updatedAt: STAMP,
        body: "이 문서는 법률 검토 전의 임시 초안입니다. 협회가 실제로 개인정보를 다루기 전에 전문가 검토를 거쳐야 합니다.\n\n1. 수집하는 항목 (예시)\n문의 폼에서는 이름, 이메일, 문의 내용을 받을 수 있습니다. 그 외의 회원 정보는 이번 단계에서 받지 않습니다.\n\n2. 이용 목적 (예시)\n보낸 문의에 답하기 위해서만 사용합니다. 광고 메일이나 대회 접수용으로 쓰지 않습니다.\n\n3. 보관 (예시)\n답변이 끝나면 지우는 것을 원칙으로 적었습니다. 보관 기간은 확정 전입니다.\n\n4. 문의\n개인정보와 관련한 질문은 연락 페이지의 메일로 보내 주세요. 메일도 현재는 예시 주소입니다.",
      },
      terms: {
        title: "이용약관",
        isDraft: true,
        updatedAt: STAMP,
        body: "이 문서는 법률 검토 전의 임시 초안입니다. 서비스 이용 규칙을 확정한 문서가 아닙니다.\n\n1. 사이트의 목적 (예시)\n이 웹사이트는 한국장타협회를 소개하고, 소식과 문의 창구를 안내하기 위한 페이지입니다.\n\n2. 아직 제공하지 않는 기능\n대회 참가 신청, 회비 결제, 회원 가입, 선수 등록은 제공하지 않습니다.\n\n3. 예시 콘텐츠\n인물, 연혁, 연락처, 소식 중 예시라고 표시된 내용은 실제 사실로 믿지 말아 주세요.\n\n4. 책임 (예시)\n임시 문구로 생긴 오해에 대해, 확정 공지가 올라오기 전에는 공식 입장으로 보지 않습니다.",
      },
    },
    inquiries: [],
    players: [],
    events: [],
  };
}
