import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { isAdminSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminSession()) redirect("/admin/login");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
