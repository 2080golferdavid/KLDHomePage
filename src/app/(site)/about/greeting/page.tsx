import type { Metadata } from "next";
import CmsImage from "@/components/site/CmsImage";
import Prose from "@/components/site/Prose";
import { getDocument } from "@/lib/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getDocument();
  const title = doc.greeting.title.trim() || "회장 인사말";
  const excerpt = doc.greeting.body.trim().replace(/\s+/g, " ").slice(0, 120);
  return {
    title,
    description: excerpt || "한국장타협회 회장 인사말 페이지입니다.",
  };
}

export default async function GreetingPage() {
  const doc = await getDocument();
  const greeting = doc.greeting;
  const title = greeting.title.trim() || "회장 인사말";
  const name = greeting.name.trim();
  const role = greeting.role.trim();
  const photo = greeting.photoUrl.trim();
  const body = greeting.body.trim();
  const showPerson = Boolean(name || role || photo);

  return (
    <main className="kld-shell py-10 pb-16">
      <p className="text-[11px] font-semibold tracking-[0.2em] text-kld-navy-2">GREETING</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>

      <article className="kld-card mt-8 p-6 sm:p-10">
        {showPerson && (
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
            {photo ? (
              <CmsImage
                src={photo}
                alt={name ? `${name} 사진` : "회장 사진"}
                className="h-48 w-40 rounded-[28px] object-cover"
              />
            ) : name ? (
              <div className="flex h-48 w-40 items-center justify-center rounded-[28px] bg-gradient-to-b from-[#E7EEF6] to-[#F7F8FB] text-5xl font-black text-[#243044]/80">
                {name.slice(0, 1)}
              </div>
            ) : null}
            {(name || role) && (
              <div>
                {role ? <p className="text-sm font-semibold text-[#1D4E89]">{role}</p> : null}
                {name ? <p className="mt-1 text-3xl font-black">{name}</p> : null}
              </div>
            )}
          </div>
        )}
        {body ? (
          <Prose text={greeting.body} />
        ) : (
          <p className="text-sm text-kld-muted">아직 등록된 인사말이 없습니다.</p>
        )}
      </article>
    </main>
  );
}
