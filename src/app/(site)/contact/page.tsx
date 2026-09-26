import type { Metadata } from "next";
import InquiryForm from "@/components/site/InquiryForm";
import { getDocument } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "연락·문의",
  description: "한국장타협회에 문의하는 곳입니다. 결제와 대회 신청은 받지 않습니다.",
};

export default async function ContactPage() {
  const doc = await getDocument();
  const { contact } = doc;

  const facts = [
    { label: "이메일", value: contact.email },
    { label: "전화", value: contact.phone },
    { label: "주소", value: contact.address },
    { label: "시간", value: contact.hours },
  ];

  return (
    <main className="kld-shell py-10 pb-16">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-kld-red">CONTACT</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">연락·문의</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-kld-muted">{contact.note}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="kld-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">협회 연락처</h2>
            {contact.isExample && <span className="kld-chip">예시</span>}
          </div>
          <dl className="mt-6 space-y-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-semibold tracking-wide text-kld-muted">{fact.label}</dt>
                <dd className="mt-1 text-base font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="kld-card p-6 sm:p-8">
          <h2 className="text-xl font-black">문의 남기기</h2>
          <p className="mt-2 text-sm text-kld-muted">결제나 참가 신청은 받지 않습니다. 협회의 이야기와 제휴 문의만 적어 주세요.</p>
          <div className="mt-6">
            <InquiryForm email={contact.email} />
          </div>
        </section>
      </div>
    </main>
  );
}
