import AboutForm from "@/components/admin/AboutForm";
import { getDocument } from "@/lib/content/repository";

export default async function AboutAdminPage() {
  const doc = await getDocument();
  return (
    <div>
      <h1 className="text-3xl font-black">소개 문구</h1>
      <p className="mb-6 mt-2 text-sm text-kld-muted">협회의 마음, 가치, 연혁을 고칩니다.</p>
      <AboutForm initial={doc.about} />
    </div>
  );
}
