import OfficialsForm from "@/components/admin/OfficialsForm";
import { getDocument } from "@/lib/content/repository";

export default async function OfficialsAdminPage() {
  const doc = await getDocument();
  return (
    <div>
      <h1 className="text-3xl font-black">임원진</h1>
      <p className="mb-6 mt-2 text-sm text-kld-muted">카드의 이름, 역할, 사진, 공개 여부를 바꿉니다. 순서가 작은 사람이 앞에 옵니다.</p>
      <OfficialsForm initial={doc.officials} />
    </div>
  );
}
