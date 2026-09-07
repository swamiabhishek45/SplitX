"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadSlide } from "@/lib/download";
import { renderMasterPreviewDataUrl } from "@/lib/image-processing";
import type {
  AspectRatio,
  FramingState,
  RenderedSlide,
  SlideCount,
} from "@/lib/types";

interface CropPreviewProps {
  slides: RenderedSlide[];
  slideCount: SlideCount;
  hideCropLines: boolean;
  isRendering: boolean;
  imageElement?: HTMLImageElement | null;
  aspectRatio?: AspectRatio;
  framing?: FramingState;
}

export function CropPreview({
  slides,
  slideCount,
  hideCropLines,
  isRendering,
  imageElement,
  aspectRatio,
  framing,
}: CropPreviewProps) {
  const masterPreview = useMemo(() => {
    if (!imageElement || !aspectRatio || !framing) return null;
    return renderMasterPreviewDataUrl(
      imageElement,
      slideCount,
      aspectRatio,
      framing
    );
  }, [imageElement, slideCount, aspectRatio, framing]);

  if (slides.length === 0) return null;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative max-h-36 overflow-hidden rounded-xl border border-border bg-muted/20 transition-opacity duration-200 sm:max-h-44",
          isRendering && "opacity-60"
        )}
      >
        {masterPreview ? (
          <div className="relative">
            <img
              src={masterPreview}
              alt="Full image with crop guides"
              className="block h-full w-full object-cover object-center"
            />
            {!hideCropLines &&
              Array.from({ length: slideCount - 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full border-r-2 border-dashed border-foreground/50"
                  style={{ left: `${((i + 1) / slideCount) * 100}%` }}
                  aria-hidden
                />
              ))}
          </div>
        ) : (
          <div className="flex">
            {slides.map((slide, i) => (
              <div key={slide.index} className="relative flex-1">
                <img
                  src={slide.dataUrl}
                  alt={`Slide ${i + 1} preview`}
                  className="block w-full"
                />
                {!hideCropLines && i < slideCount - 1 && (
                  <div
                    className="absolute right-0 top-0 z-10 h-full w-px border-r-2 border-dashed border-foreground/50"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
          {slideCount} slides
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        X rounds corners and leaves small gaps — keep important elements away from
        the cut lines.
      </p>
    </div>
  );
}

interface XCarouselPreviewProps {
  slides: RenderedSlide[];
  isRendering: boolean;
}

export function XCarouselPreview({ slides, isRendering }: XCarouselPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const goNext = () =>
    setCurrentIndex((i) => Math.min(i + 1, slides.length - 1));
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  const { width, height } = slides[0];
  const hasNextSlide = currentIndex < slides.length - 1;
  const currentSlide = slides[currentIndex];
  const nextSlide = hasNextSlide ? slides[currentIndex + 1] : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background p-3 transition-opacity duration-200 sm:p-4",
        isRendering && "opacity-60"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
          T
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1">
            <span className="text-[15px] font-bold leading-tight">
              Thomas Sanlis
            </span>
            <span className="text-[15px] text-muted-foreground">@T_Zahil</span>
          </div>
          <p className="mt-0.5 text-[15px] leading-snug">
            Testing carousel for X
          </p>

          <div
            className="relative mt-2.5 w-full"
            style={{ aspectRatio: `${width * 2} / ${height}` }}
          >
            <div className="absolute inset-0 flex gap-0.5">
              <div className="h-full min-w-0 flex-1 overflow-hidden rounded-2xl bg-black">
                <img
                  src={currentSlide.dataUrl}
                  alt={`Carousel slide ${currentSlide.index}`}
                  className="size-full"
                  width={currentSlide.width}
                  height={currentSlide.height}
                  draggable={false}
                />
              </div>

              {nextSlide ? (
                <div className="h-full min-w-0 flex-1 overflow-hidden rounded-2xl bg-black">
                  <img
                    src={nextSlide.dataUrl}
                    alt={`Carousel slide ${nextSlide.index}`}
                    className="size-full"
                    width={nextSlide.width}
                    height={nextSlide.height}
                    draggable={false}
                  />
                </div>
              ) : (
                <div
                  className="h-full min-w-0 flex-1 rounded-2xl bg-muted/15"
                  aria-hidden
                />
              )}
            </div>

            {currentIndex > 0 && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-opacity hover:bg-black/75"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {currentIndex < slides.length - 1 && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-opacity hover:bg-black/75"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-2.5 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "rounded-full transition-all duration-200",
                  i === currentIndex
                    ? "h-2 w-2 bg-sky-500"
                    : "h-2 w-2 bg-muted-foreground/35"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[13px] text-muted-foreground">
            <span>9:46 PM · Sep 7, 2026</span>
            <span>6,406 Views</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DownloadSectionProps {
  slides: RenderedSlide[];
  slideCount: SlideCount;
  format: "png" | "jpeg";
  isDownloading: boolean;
  onDownloadAll: () => void;
}

export function DownloadSection({
  slides,
  slideCount,
  format,
  isDownloading,
  onDownloadAll,
}: DownloadSectionProps) {
  if (slides.length === 0) return null;

  return (
    <div className="space-y-3">
      <Button
        size="default"
        className="w-full"
        onClick={onDownloadAll}
        disabled={isDownloading}
      >
        <Download className="h-4 w-4" />
        {isDownloading
          ? "Preparing download..."
          : `Download all ${slideCount}`}
      </Button>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slides.map((slide) => (
          <Button
            key={slide.index}
            variant="secondary"
            size="sm"
            onClick={() => downloadSlide(slide, format)}
            className="text-xs"
          >
            <Download className="h-3 w-3" />
            Slide {slide.index}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function PreviewPanel({
  slides,
  slideCount,
  format,
  hideCropLines,
  isRendering,
  isDownloading,
  onDownloadAll,
  imageElement,
  aspectRatio,
  framing,
}: CropPreviewProps &
  XCarouselPreviewProps &
  DownloadSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold">Preview on X</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Exactly what you will download.
        </p>
      </div>

      <CropPreview
        slides={slides}
        slideCount={slideCount}
        hideCropLines={hideCropLines}
        isRendering={isRendering}
        imageElement={imageElement}
        aspectRatio={aspectRatio}
        framing={framing}
      />

      <XCarouselPreview slides={slides} isRendering={isRendering} />

      <DownloadSection
        slides={slides}
        slideCount={slideCount}
        format={format}
        isDownloading={isDownloading}
        onDownloadAll={onDownloadAll}
      />
    </div>
  );
}
