"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  LOGO_ASPECTS,
  MAX_ZOOM,
  MIN_ZOOM,
  type CropView,
  type LogoAspectId,
  type Raster,
  aspectRatio,
  containBox,
  exportCroppedLogo,
  layoutCrop,
  paintCrop,
  rasterizeForEdit,
  zoomAtPoint,
} from "@/components/admin/logo-crop";

const EMPTY_VIEW: CropView = { zoom: 1, panX: 0, panY: 0 };

function fitCanvas(canvas: HTMLCanvasElement, cssW: number, cssH: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(cssW * dpr));
  const height = Math.max(1, Math.round(cssH * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export default function LogoCropDialog({
  source,
  onApply,
  onCancel,
}: {
  source: string;
  onApply: (dataUrl: string) => void;
  onCancel: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLCanvasElement>(null);
  const largeRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);

  const [raster, setRaster] = useState<Raster | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [aspectId, setAspectId] = useState<LogoAspectId>("source");
  const [view, setView] = useState<CropView>(EMPTY_VIEW);
  const [pending, setPending] = useState(false);
  const [stageW, setStageW] = useState(560);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    if (!source.startsWith("data:")) image.crossOrigin = "anonymous";
    image.onload = () => {
      if (cancelled) return;
      if (!image.naturalWidth || !image.naturalHeight) {
        setLoadError("그림 크기를 읽지 못했습니다. PNG나 JPG로 다시 올려 주세요.");
        return;
      }
      setRaster(rasterizeForEdit(image, image.naturalWidth, image.naturalHeight));
    };
    image.onerror = () => {
      if (cancelled) return;
      setLoadError("이 그림은 여기서 자를 수 없습니다. 파일을 다시 올려 주세요.");
    };
    image.src = source;
    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageW(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [raster]);

  const ratio = raster ? aspectRatio(aspectId, raster.width, raster.height) : 1;
  const frame = containBox(ratio, Math.max(240, stageW), 220);
  const headerPreview = containBox(ratio, 200, 48);
  const largePreview = containBox(ratio, 360, 112);

  useLayoutEffect(() => {
    if (!raster) return;
    const layout = layoutCrop({
      frameW: frame.width,
      frameH: frame.height,
      imageW: raster.width,
      imageH: raster.height,
      zoom: view.zoom,
      panX: view.panX,
      panY: view.panY,
    });
    const targets: { canvas: HTMLCanvasElement | null; width: number; height: number }[] = [
      { canvas: frameRef.current, width: frame.width, height: frame.height },
      { canvas: headerRef.current, width: headerPreview.width, height: headerPreview.height },
      { canvas: largeRef.current, width: largePreview.width, height: largePreview.height },
    ];
    for (const target of targets) {
      if (!target.canvas) continue;
      const ctx = fitCanvas(target.canvas, target.width, target.height);
      if (!ctx) continue;
      paintCrop(ctx, raster, layout, target.width, target.height);
    }
  }, [raster, frame.width, frame.height, headerPreview.width, headerPreview.height, largePreview.width, largePreview.height, view]);

  useEffect(() => {
    const canvas = frameRef.current;
    if (!canvas || !raster) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (pending) return;
      const rect = canvas.getBoundingClientRect();
      const factor = event.deltaY < 0 ? 1.08 : 1 / 1.08;
      const pointerX = rect.width ? ((event.clientX - rect.left) / rect.width) * frame.width : frame.width / 2;
      const pointerY = rect.height ? ((event.clientY - rect.top) / rect.height) * frame.height : frame.height / 2;
      setView((current) =>
        zoomAtPoint({
          frameW: frame.width,
          frameH: frame.height,
          imageW: raster.width,
          imageH: raster.height,
          zoom: current.zoom,
          panX: current.panX,
          panY: current.panY,
          pointerX,
          pointerY,
          factor,
        }),
      );
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [raster, frame.width, frame.height, pending]);

  function zoomBy(factor: number, pointerX: number, pointerY: number) {
    if (!raster || pending) return;
    setView((current) =>
      zoomAtPoint({
        frameW: frame.width,
        frameH: frame.height,
        imageW: raster.width,
        imageH: raster.height,
        zoom: current.zoom,
        panX: current.panX,
        panY: current.panY,
        pointerX,
        pointerY,
        factor,
      }),
    );
  }

  function nudgeZoom(factor: number) {
    zoomBy(factor, frame.width / 2, frame.height / 2);
  }

  function setZoomTo(nextZoom: number) {
    if (!raster || pending) return;
    setView((current) =>
      zoomAtPoint({
        frameW: frame.width,
        frameH: frame.height,
        imageW: raster.width,
        imageH: raster.height,
        zoom: current.zoom,
        panX: current.panX,
        panY: current.panY,
        pointerX: frame.width / 2,
        pointerY: frame.height / 2,
        factor: current.zoom > 0 ? nextZoom / current.zoom : 1,
      }),
    );
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (pending) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId || !raster || pending) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = rect.width / frame.width || 1;
    const scaleY = rect.height / frame.height || 1;
    const dx = (event.clientX - drag.x) / scaleX;
    const dy = (event.clientY - drag.y) / scaleY;
    drag.x = event.clientX;
    drag.y = event.clientY;
    setView((current) => {
      const laid = layoutCrop({
        frameW: frame.width,
        frameH: frame.height,
        imageW: raster.width,
        imageH: raster.height,
        zoom: current.zoom,
        panX: current.panX,
        panY: current.panY,
      });
      if (!(laid.drawW > 0) || !(laid.drawH > 0)) return current;
      const next = layoutCrop({
        frameW: frame.width,
        frameH: frame.height,
        imageW: raster.width,
        imageH: raster.height,
        zoom: current.zoom,
        panX: current.panX + dx / laid.drawW,
        panY: current.panY + dy / laid.drawH,
      });
      return { zoom: current.zoom, panX: next.panX, panY: next.panY };
    });
  }

  function endDrag(event: React.PointerEvent<HTMLCanvasElement>) {
    if (dragRef.current?.id === event.pointerId) dragRef.current = null;
  }

  async function apply() {
    if (!raster || pending) return;
    setPending(true);
    setActionError(null);
    try {
      const layout = layoutCrop({
        frameW: frame.width,
        frameH: frame.height,
        imageW: raster.width,
        imageH: raster.height,
        zoom: view.zoom,
        panX: view.panX,
        panY: view.panY,
      });
      const dataUrl = await exportCroppedLogo(raster, layout);
      onApply(dataUrl);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "로고를 만들지 못했습니다.");
      setPending(false);
    }
  }

  const zoomLabel = `${Math.round(view.zoom * 100)}%`;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0B1B33]/55 p-4 sm:items-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logo-crop-title"
        tabIndex={-1}
        className="kld-card max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto p-5 outline-none sm:p-6"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onCancel();
          }
          if (event.key === "Enter" && !(event.target instanceof HTMLButtonElement)) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <h2 id="logo-crop-title" className="text-lg font-black">
          로고 자르기
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-kld-muted">
          네모 안이 저장됩니다. 그림을 끌어 위치를 옮기고, 확대/축소로 빈 여백을 줄이세요. 네모를 로고로 채우면 헤더에서 더 잘 보입니다.
        </p>

        {loadError ? (
          <p className="mt-4 text-sm text-kld-red" role="alert">
            {loadError}
          </p>
        ) : !raster ? (
          <p className="mt-4 text-sm text-kld-muted">그림을 불러오는 중…</p>
        ) : (
          <>
            <div className="mt-4" role="group" aria-label="자르기 모양">
              <span className="kld-label">자르기 모양</span>
              <div className="flex flex-wrap gap-2">
                {LOGO_ASPECTS.map((item) => {
                  const selected = item.id === aspectId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                        selected ? "bg-kld-navy text-white" : "border border-kld-line bg-white text-kld-ink hover:bg-kld-paper"
                      }`}
                      onClick={() => {
                        setAspectId(item.id);
                        setView(EMPTY_VIEW);
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div ref={stageRef} className="mt-4">
              <span className="kld-label">위치 이동</span>
              <div className="kld-checker inline-block overflow-hidden rounded-2xl ring-2 ring-kld-navy">
                <canvas
                  ref={frameRef}
                  aria-label="로고 위치 이동. 끌어서 옮기세요."
                  className="block cursor-grab touch-none active:cursor-grabbing"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                />
              </div>
              <p className="mt-2 text-xs text-kld-muted">그림을 끌어서 옮기세요. 마우스 휠로도 확대/축소할 수 있습니다.</p>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="kld-label mb-0">확대/축소</span>
                <span className="text-sm font-semibold text-kld-ink">{zoomLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="kld-btn-line px-3 py-2" onClick={() => nudgeZoom(1 / 1.15)} disabled={pending}>
                  축소
                </button>
                <input
                  className="h-2 w-full accent-kld-navy"
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={0.01}
                  value={view.zoom}
                  aria-valuemin={MIN_ZOOM}
                  aria-valuemax={MAX_ZOOM}
                  aria-valuenow={view.zoom}
                  aria-valuetext={zoomLabel}
                  aria-label="확대/축소"
                  disabled={pending}
                  onChange={(event) => setZoomTo(Number(event.target.value))}
                />
                <button type="button" className="kld-btn-line px-3 py-2" onClick={() => nudgeZoom(1.15)} disabled={pending}>
                  확대
                </button>
              </div>
              <p className="mt-1 text-xs text-kld-muted">100%는 그림 전체가 네모 안에 들어오는 크기입니다.</p>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
              <figure>
                <figcaption className="mb-1 text-xs font-semibold text-kld-muted">헤더 크기</figcaption>
                <div className="kld-checker inline-flex rounded-2xl border border-kld-line p-2">
                  <canvas ref={headerRef} aria-hidden="true" className="block" />
                </div>
              </figure>
              <figure>
                <figcaption className="mb-1 text-xs font-semibold text-kld-muted">크게 보기</figcaption>
                <div className="kld-checker inline-flex rounded-2xl border border-kld-line p-2">
                  <canvas ref={largeRef} aria-hidden="true" className="block" />
                </div>
              </figure>
            </div>
          </>
        )}

        {actionError && (
          <p className="mt-3 text-sm text-kld-red" role="alert">
            {actionError}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="kld-btn-line" onClick={onCancel} disabled={pending}>
            취소
          </button>
          <button type="button" className="kld-btn-navy" onClick={() => void apply()} disabled={!raster || pending || Boolean(loadError)}>
            {pending ? "적용하는 중…" : "적용"}
          </button>
        </div>
      </div>
    </div>
  );
}
