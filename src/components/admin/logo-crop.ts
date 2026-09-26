import { isImageDataUrl, MAX_DATA_URL_LENGTH, MAX_MEDIA_FILE_BYTES } from "@/lib/content/urls";

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 6;

export const LOGO_ASPECTS = [
  { id: "wide", label: "가로형", ratio: 3.2 },
  { id: "normal", label: "보통", ratio: 2 },
  { id: "square", label: "정사각형", ratio: 1 },
  { id: "source", label: "원본 비율" },
] as const;

export type LogoAspectId = (typeof LOGO_ASPECTS)[number]["id"];

export type CropView = {
  zoom: number;
  panX: number;
  panY: number;
};

export type CropLayout = {
  frameW: number;
  frameH: number;
  drawW: number;
  drawH: number;
  x: number;
  y: number;
  zoom: number;
  panX: number;
  panY: number;
};

export type Raster = {
  source: CanvasImageSource;
  width: number;
  height: number;
};

const EXPORT_HEIGHTS = [192, 144, 112, 88, 64];

export function clampZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) return 1;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

/** 너무 납작하거나 너무 긴 비율은 헤더 칸에서 안 보이므로 상한만 둔다. */
export function safeRatio(width: number, height: number): number {
  if (!(width > 0) || !(height > 0)) return 1;
  const ratio = width / height;
  if (!Number.isFinite(ratio)) return 1;
  return Math.min(8, Math.max(0.25, ratio));
}

export function aspectRatio(id: LogoAspectId, imageW: number, imageH: number): number {
  if (id === "source") return safeRatio(imageW, imageH);
  const preset = LOGO_ASPECTS.find((item) => item.id === id);
  return preset && "ratio" in preset && preset.ratio ? preset.ratio : 1;
}

/** max 상자 안에 비율을 유지한 채 들어가는 크기. 헤더의 object-contain 과 같다. */
export function containBox(ratio: number, maxW: number, maxH: number): { width: number; height: number } {
  const safe = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  const boundW = Math.max(1, maxW);
  const boundH = Math.max(1, maxH);
  let height = boundH;
  let width = Math.round(height * safe);
  if (width > boundW) {
    width = boundW;
    height = Math.max(1, Math.round(width / safe));
  }
  return { width: Math.max(1, width), height: Math.max(1, height) };
}

function drawnSize(frameW: number, frameH: number, imageW: number, imageH: number, zoom: number) {
  if (!(imageW > 0) || !(imageH > 0) || !(frameW > 0) || !(frameH > 0)) {
    return { drawW: 0, drawH: 0, zoom: clampZoom(zoom) };
  }
  const contain = Math.min(frameW / imageW, frameH / imageH);
  const z = clampZoom(zoom);
  return {
    drawW: imageW * contain * z,
    drawH: imageH * contain * z,
    zoom: z,
  };
}

export function clampPanFraction(
  panX: number,
  panY: number,
  drawW: number,
  drawH: number,
  frameW: number,
  frameH: number,
): { panX: number; panY: number } {
  return {
    panX: clampAxis(panX, drawW, frameW),
    panY: clampAxis(panY, drawH, frameH),
  };
}

function clampAxis(pan: number, draw: number, frame: number): number {
  if (!(draw > 0) || !(frame > 0) || !Number.isFinite(pan)) return 0;
  const keep = Math.min(28, frame / 2, draw / 2);
  const base = (frame - draw) / 2;
  const min = (keep - draw - base) / draw;
  const max = (frame - keep - base) / draw;
  if (min > max) return 0;
  return Math.min(max, Math.max(min, pan));
}

export function layoutCrop(input: {
  frameW: number;
  frameH: number;
  imageW: number;
  imageH: number;
  zoom: number;
  panX: number;
  panY: number;
}): CropLayout {
  if (!(input.imageW > 0) || !(input.imageH > 0) || !(input.frameW > 0) || !(input.frameH > 0)) {
    return {
      frameW: input.frameW,
      frameH: input.frameH,
      drawW: 0,
      drawH: 0,
      x: 0,
      y: 0,
      zoom: 1,
      panX: 0,
      panY: 0,
    };
  }
  const { drawW, drawH, zoom } = drawnSize(input.frameW, input.frameH, input.imageW, input.imageH, input.zoom);
  const pan = clampPanFraction(input.panX, input.panY, drawW, drawH, input.frameW, input.frameH);
  return {
    frameW: input.frameW,
    frameH: input.frameH,
    drawW,
    drawH,
    x: (input.frameW - drawW) / 2 + pan.panX * drawW,
    y: (input.frameH - drawH) / 2 + pan.panY * drawH,
    zoom,
    panX: pan.panX,
    panY: pan.panY,
  };
}

/** 마우스 아래의 그림 점이 확대 후에도 그 자리에 있게 이동량을 다시 계산한다. */
export function zoomAtPoint(input: {
  frameW: number;
  frameH: number;
  imageW: number;
  imageH: number;
  zoom: number;
  panX: number;
  panY: number;
  pointerX: number;
  pointerY: number;
  factor: number;
}): CropView {
  const before = layoutCrop(input);
  const imageX = before.drawW ? (input.pointerX - before.x) / before.drawW : 0.5;
  const imageY = before.drawH ? (input.pointerY - before.y) / before.drawH : 0.5;
  const zoom = clampZoom(before.zoom * input.factor);
  const after = drawnSize(input.frameW, input.frameH, input.imageW, input.imageH, zoom);
  const panX = after.drawW
    ? (input.pointerX - imageX * after.drawW - (input.frameW - after.drawW) / 2) / after.drawW
    : 0;
  const panY = after.drawH
    ? (input.pointerY - imageY * after.drawH - (input.frameH - after.drawH) / 2) / after.drawH
    : 0;
  const pan = clampPanFraction(panX, panY, after.drawW, after.drawH, input.frameW, input.frameH);
  return { zoom, panX: pan.panX, panY: pan.panY };
}

export function imageDataHasTransparency(data: Uint8ClampedArray): boolean {
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] !== 255) return true;
  }
  return false;
}

export function exportFits(byteLength: number, dataUrl: string): boolean {
  return (
    byteLength > 0 &&
    byteLength <= MAX_MEDIA_FILE_BYTES &&
    dataUrl.length > 0 &&
    dataUrl.length <= MAX_DATA_URL_LENGTH &&
    isImageDataUrl(dataUrl)
  );
}

export function rasterizeForEdit(image: CanvasImageSource, width: number, height: number, maxSide = 2048): Raster {
  if (width <= maxSide && height <= maxSide) {
    return { source: image, width, height };
  }
  const scale = maxSide / Math.max(width, height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return { source: image, width, height };
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return { source: canvas, width: canvas.width, height: canvas.height };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("그림을 읽지 못했습니다."));
    reader.readAsDataURL(blob);
  });
}

async function encodeWithinLimit(canvas: HTMLCanvasElement, hasAlpha: boolean): Promise<string | null> {
  if (hasAlpha) {
    const blob = await canvasToBlob(canvas, "image/png");
    if (!blob) return null;
    const dataUrl = await blobToDataUrl(blob);
    return exportFits(blob.size, dataUrl) ? dataUrl : null;
  }

  const attempts: { type: string; qualities: number[] }[] = [
    { type: "image/webp", qualities: [0.9, 0.78, 0.66, 0.52] },
    { type: "image/jpeg", qualities: [0.9, 0.76, 0.62, 0.5] },
  ];

  for (const attempt of attempts) {
    for (const quality of attempt.qualities) {
      const blob = await canvasToBlob(canvas, attempt.type, quality);
      if (!blob) continue;
      if (attempt.type === "image/webp" && blob.type && !blob.type.includes("webp")) continue;
      const dataUrl = await blobToDataUrl(blob);
      if (exportFits(blob.size, dataUrl)) return dataUrl;
    }
  }
  return null;
}

export async function exportCroppedLogo(raster: Raster, layout: CropLayout): Promise<string> {
  for (const targetHeight of EXPORT_HEIGHTS) {
    const scale = targetHeight / layout.frameH;
    const width = Math.max(1, Math.round(layout.frameW * scale));
    const height = Math.max(1, Math.round(layout.frameH * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("그림을 만들지 못했습니다.");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const scaleX = width / layout.frameW;
    const scaleY = height / layout.frameH;
    ctx.drawImage(raster.source, layout.x * scaleX, layout.y * scaleY, layout.drawW * scaleX, layout.drawH * scaleY);

    let hasAlpha = false;
    try {
      hasAlpha = imageDataHasTransparency(ctx.getImageData(0, 0, width, height).data);
    } catch {
      throw new Error("이 그림은 여기서 자를 수 없습니다. 파일을 다시 올려 주세요.");
    }

    const dataUrl = await encodeWithinLimit(canvas, hasAlpha);
    if (dataUrl) return dataUrl;
  }

  throw new Error("자른 로고가 450KB를 넘습니다. 확대를 낮추거나 더 단순한 그림을 써 주세요.");
}

export function paintCrop(
  ctx: CanvasRenderingContext2D,
  raster: Raster,
  layout: CropLayout,
  destW: number,
  destH: number,
) {
  ctx.clearRect(0, 0, destW, destH);
  const scaleX = destW / layout.frameW;
  const scaleY = destH / layout.frameH;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(raster.source, layout.x * scaleX, layout.y * scaleY, layout.drawW * scaleX, layout.drawH * scaleY);
}
