"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  calculateDefaultFraming,
  loadImageFromFile,
  renderSlides,
} from "@/lib/image-processing";
import {
  ACCEPTED_IMAGE_TYPES,
  DEFAULT_SETTINGS,
  MAX_FILE_SIZE,
  MAX_IMAGE_DIMENSION,
  type FramingState,
  type RenderedSlide,
  type SourceImage,
  type SplitSettings,
} from "@/lib/types";

export type ImageEditorError =
  | "unsupported-type"
  | "corrupted"
  | "too-large"
  | "too-small"
  | "paste-failed"
  | "generic";

const ERROR_MESSAGES: Record<ImageEditorError, string> = {
  "unsupported-type": "Please upload a PNG, JPEG, or WebP image.",
  corrupted: "This image could not be loaded. It may be corrupted.",
  "too-large": "This image is too large. Please use a file under 50 MB.",
  "too-small": "This image is too small. Try an image at least 600 px wide.",
  "paste-failed": "Could not paste from clipboard. Try drag and drop instead.",
  generic: "Something went wrong. Please try again.",
};

export function useImageEditor() {
  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null
  );
  const [settings, setSettings] = useState<SplitSettings>(DEFAULT_SETTINGS);
  const [slides, setSlides] = useState<RenderedSlide[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<ImageEditorError | null>(null);
  const [hideCropLines, setHideCropLines] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const renderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const processFile = useCallback(async (file: File) => {
    setError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type as typeof ACCEPTED_IMAGE_TYPES[number])) {
      setError("unsupported-type");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("too-large");
      return;
    }

    try {
      const img = await loadImageFromFile(file);

      if (
        img.naturalWidth > MAX_IMAGE_DIMENSION ||
        img.naturalHeight > MAX_IMAGE_DIMENSION
      ) {
        setError("too-large");
        return;
      }

      if (img.naturalWidth < 600) {
        setError("too-small");
        return;
      }

      const url = URL.createObjectURL(file);
      const defaultFraming = calculateDefaultFraming(
        img.naturalWidth,
        img.naturalHeight,
        DEFAULT_SETTINGS.slideCount,
        DEFAULT_SETTINGS.aspectRatio
      );

      setSourceImage({
        file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        name: file.name,
      });
      setImageElement(img);
      setSettings({
        ...DEFAULT_SETTINGS,
        framing: defaultFraming,
      });
    } catch {
      setError("corrupted");
    }
  }, []);

  const removeImage = useCallback(() => {
    if (sourceImage?.url) {
      URL.revokeObjectURL(sourceImage.url);
    }
    setSourceImage(null);
    setImageElement(null);
    setSlides([]);
    setSettings(DEFAULT_SETTINGS);
    setError(null);
  }, [sourceImage]);

  const updateSettings = useCallback(
    (partial: Partial<SplitSettings>) => {
      setSettings((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  const updateFraming = useCallback((partial: Partial<FramingState>) => {
    setSettings((prev) => ({
      ...prev,
      framing: { ...prev.framing, ...partial },
    }));
  }, []);

  const resetFraming = useCallback(() => {
    if (!imageElement) return;
    const defaultFraming = calculateDefaultFraming(
      imageElement.naturalWidth,
      imageElement.naturalHeight,
      settings.slideCount,
      settings.aspectRatio
    );
    updateFraming(defaultFraming);
  }, [imageElement, settings.slideCount, settings.aspectRatio, updateFraming]);

  useEffect(() => {
    if (!imageElement) {
      setSlides([]);
      return;
    }

    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    setIsRendering(true);

    renderTimeoutRef.current = setTimeout(async () => {
      try {
        const rendered = await renderSlides(
          imageElement,
          settings.slideCount,
          settings.aspectRatio,
          settings.framing,
          settings.format
        );
        setSlides(rendered);
      } catch {
        setError("generic");
      } finally {
        setIsRendering(false);
      }
    }, 50);

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [imageElement, settings]);

  useEffect(() => {
    if (!imageElement || !sourceImage) return;

    const defaultFraming = calculateDefaultFraming(
      imageElement.naturalWidth,
      imageElement.naturalHeight,
      settings.slideCount,
      settings.aspectRatio
    );
    updateFraming(defaultFraming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.slideCount, settings.aspectRatio]);

  return {
    sourceImage,
    imageElement,
    settings,
    slides,
    isRendering,
    isDownloading,
    setIsDownloading,
    error,
    errorMessage: error ? ERROR_MESSAGES[error] : null,
    hideCropLines,
    setHideCropLines,
    processFile,
    removeImage,
    updateSettings,
    updateFraming,
    resetFraming,
    clearError,
    setPasteError: () => setError("paste-failed"),
  };
}
