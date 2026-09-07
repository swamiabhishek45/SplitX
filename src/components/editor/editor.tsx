"use client";

import { useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UploadArea, EmptyUploadState } from "@/components/editor/upload-area";
import { SplitControls } from "@/components/editor/split-controls";
import { PreviewPanel } from "@/components/editor/preview-panel";
import { useImageEditor } from "@/hooks/use-image-editor";
import { downloadAllSlides } from "@/lib/download";

export function Editor() {
  const {
    sourceImage,
    imageElement,
    settings,
    slides,
    isRendering,
    isDownloading,
    setIsDownloading,
    errorMessage,
    hideCropLines,
    setHideCropLines,
    processFile,
    removeImage,
    updateSettings,
    updateFraming,
    resetFraming,
    clearError,
    setPasteError,
  } = useImageEditor();

  const handlePasteError = useCallback(() => {
    setPasteError();
  }, [setPasteError]);

  const handleDownloadAll = useCallback(async () => {
    if (slides.length === 0) return;
    setIsDownloading(true);
    try {
      await downloadAllSlides(slides, settings.format);
    } finally {
      setIsDownloading(false);
    }
  }, [slides, settings.format, setIsDownloading]);

  if (!sourceImage) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-3xl px-4 py-8 text-center sm:px-6 sm:py-12">
            <h1 className="text-2xl font-medium leading-[1.25] tracking-tight sm:text-4xl">
              Split an image
            </h1>
            <p className="mt-3 text-muted-foreground">
              Drop a wide image. You get equal parts and a preview of the post.
            </p>
          </div>
          <EmptyUploadState
            onFileSelect={processFile}
            onPasteError={handlePasteError}
            errorMessage={errorMessage}
            onClearError={clearError}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
            <aside className="order-2 space-y-6 sm:space-y-8 lg:order-1">
              <section className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold">1. Add your image</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Drop it, paste it, or pick a file. It never leaves your browser.
                  </p>
                </div>
                <UploadArea
                  sourceImage={sourceImage}
                  onFileSelect={processFile}
                  onPasteError={handlePasteError}
                  errorMessage={errorMessage}
                  onClearError={clearError}
                />
              </section>

              <SplitControls
                slideCount={settings.slideCount}
                aspectRatio={settings.aspectRatio}
                format={settings.format}
                framing={settings.framing}
                hideCropLines={hideCropLines}
                onSlideCountChange={(count) =>
                  updateSettings({ slideCount: count })
                }
                onAspectRatioChange={(ratio) =>
                  updateSettings({ aspectRatio: ratio })
                }
                onFormatChange={(format) => updateSettings({ format })}
                onFramingChange={updateFraming}
                onResetFraming={resetFraming}
                onToggleCropLines={() => setHideCropLines((v) => !v)}
                onRemoveImage={removeImage}
              />
            </aside>

            <div className="order-1 min-w-0 lg:order-2">
              <PreviewPanel
                slides={slides}
                slideCount={settings.slideCount}
                format={settings.format}
                hideCropLines={hideCropLines}
                isRendering={isRendering}
                isDownloading={isDownloading}
                onDownloadAll={handleDownloadAll}
                imageElement={imageElement}
                aspectRatio={settings.aspectRatio}
                framing={settings.framing}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
