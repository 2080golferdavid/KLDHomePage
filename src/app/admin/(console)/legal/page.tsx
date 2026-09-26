import LegalForm from "@/components/admin/LegalForm";
import { getDocument } from "@/lib/content/repository";

export default async function LegalAdminPage() {
  const doc = await getDocument();
  return (
    <div>
      <h1 className="text-3xl font-black">법적 문서</h1>
      <p className="mb-6 mt-2 text-sm text-kld-muted">개인정보처리방침과 이용약관입니다. 본문을 고친 뒤 저장하면 공개 페이지에 바로 반영됩니다.</p>
      <LegalForm privacy={doc.legal.privacy} terms={doc.legal.terms} />
    </div>
  );
}
