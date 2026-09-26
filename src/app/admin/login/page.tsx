import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { adminConfigured, isAdminSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  if (isAdminSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <LoginForm configured={adminConfigured()} />
    </main>
  );
}
