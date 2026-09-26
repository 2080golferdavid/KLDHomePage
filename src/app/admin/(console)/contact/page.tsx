import ContactForm from "@/components/admin/ContactForm";
import { getDocument } from "@/lib/content/repository";

export default async function ContactAdminPage() {
  const doc = await getDocument();
  return (
    <div>
      <h1 className="text-3xl font-black">연락처</h1>
      <p className="mb-6 mt-2 text-sm text-kld-muted">공개 연락 페이지의 메일, 전화, 주소, 안내 문장을 바꿉니다.</p>
      <ContactForm initial={doc.contact} />
    </div>
  );
}
