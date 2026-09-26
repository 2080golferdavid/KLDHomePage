import SettingsForm from "@/components/admin/SettingsForm";
import { getDocument } from "@/lib/content/repository";

export default async function SettingsPage() {
  const doc = await getDocument();
  return (
    <div>
      <h1 className="text-3xl font-black">사이트 설정</h1>
      <p className="mb-6 mt-2 text-sm text-kld-muted">이름, 슬로건, 로고, 파비콘, 첫 화면, 바닥글, SNS를 바꿉니다.</p>
      <SettingsForm initial={doc.settings} />
    </div>
  );
}
