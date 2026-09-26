import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "@/lib/content/repository";

const FALLBACK: Record<string, string> = {
  logo: "/brand/kld-wordmark.svg",
  favicon: "/icon.svg",
};

function fromDataUrl(value: string): { mime: string; bytes: Uint8Array } | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/.exec(value);
  if (!match) return null;
  const bytes = new Uint8Array(Buffer.from(match[2].replace(/\s/g, ""), "base64"));
  if (bytes.byteLength === 0) return null;
  return { mime: match[1], bytes };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { asset: string } },
) {
  const asset = params.asset;
  if (asset !== "logo" && asset !== "favicon" && asset !== "hero") {
    return new NextResponse("Not found", { status: 404 });
  }

  const doc = await getDocument();
  const value =
    asset === "logo"
      ? doc.settings.logoUrl
      : asset === "favicon"
        ? doc.settings.faviconUrl
        : doc.settings.heroImageUrl;

  const trimmed = value.trim();
  if (!trimmed) {
    const fallback = FALLBACK[asset];
    if (!fallback) return new NextResponse(null, { status: 404 });
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  if (trimmed.startsWith("data:")) {
    const parsed = fromDataUrl(trimmed);
    if (!parsed) return new NextResponse("Bad image", { status: 400 });
    return new NextResponse(Buffer.from(parsed.bytes), {
      headers: {
        "Content-Type": parsed.mime,
        "Cache-Control": "no-store",
      },
    });
  }

  if (trimmed.startsWith("/")) {
    return NextResponse.redirect(new URL(trimmed, req.url));
  }

  return NextResponse.redirect(trimmed);
}
