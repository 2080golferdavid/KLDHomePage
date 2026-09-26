import GreetingForm from "@/components/admin/GreetingForm";
import { getDocument } from "@/lib/content/repository";

export default async function GreetingAdminPage() {
  const doc = await getDocument();
  return (
    <div>
      <h1 className="text-3xl font-black">회장 인사말</h1>
      <p className="mb-6 mt-2 text-sm text-kld-muted">
        공개 페이지 /about/greeting 에 나오는 제목, 본문, 이름, 직함, 사진을 고칩니다.
      </p>
      <GreetingForm initial={doc.greeting} />
    </div>
  );
}
