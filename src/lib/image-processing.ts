import {
  ASPECT_RATIO_DIMENSIONS,
  type AspectRatio,
  type FramingState,
  type RenderedSlide,
  type SlideCount,
  type ExportFormat,
} from "./types";

export function getSlideDimensions(aspectRatio: AspectRatio) {
  return ASPECT_RATIO_DIMENSIONS[aspectRatio];
}

export function getTotalCanvasSize(
  slideCount: SlideCount,
  aspectRatio: AspectRatio
) {
  const { width, height } = getSlideDimensions(aspectRatio);
  return {
    width: width * slideCount,
    height,
    slideWidth: width,
    slideHeight: height,
  };
}

export function calculateDefaultFraming(
  imageWidth: number,
  imageHeight: number,
  slideCount: SlideCount,
  aspectRatio: AspectRatio
): FramingState {
  const { width: canvasWidth, height: canvasHeight } = getTotalCanvasSize(
    slideCount,
    aspectRatio
  );

  const coverScale = Math.max(
    canvasWidth / imageWidth,
    canvasHeight / imageHeight
  );
  const scaledWidth = imageWidth * coverScale;
  const scaledHeight = imageHeight * coverScale;

  const horizontal =
    scaledWidth > canvasWidth
      ? 50
      : ((canvasWidth - scaledWidth) / 2 / Math.max(canvasWidth - scaledWidth, 1)) * 100;

  const vertical =
    scaledHeight > canvasHeight
      ? 50
      : ((canvasHeight - scaledHeight) / 2 / Math.max(canvasHeight - scaledHeight, 1)) * 100;

  return {
    zoom: 100,
    horizontal: Math.min(100, Math.max(0, horizontal)),
    vertical: Math.min(100, Math.max(0, vertical)),
  };
}

function getImageDrawRect(
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  framing: FramingState
) {
  const baseScale = Math.max(
    canvasWidth / imageWidth,
    canvasHeight / imageHeight
  );
  const scale = baseScale * (framing.zoom / 100);

  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  const overflowX = scaledWidth - canvasWidth;
  const overflowY = scaledHeight - canvasHeight;

  const dx =
    overflowX > 0
      ? -overflowX * (framing.horizontal / 100)
      : (canvasWidth - scaledWidth) * (framing.horizontal / 100);

  const dy =
    overflowY > 0
      ? -overflowY * (framing.vertical / 100)
      : (canvasHeight - scaledHeight) * (framing.vertical / 100);

  return { dx, dy, dw: scaledWidth, dh: scaledHeight };
}

export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image. The file may be corrupted."));
    };

    img.src = url;
  });
}

export async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Could not load image. The file may be corrupted."));

    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  quality = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to export image."));
      },
      mimeType,
      quality
    );
  });
}

export async function renderSlides(
  image: HTMLImageElement,
  slideCount: SlideCount,
  aspectRatio: AspectRatio,
  framing: FramingState,
  format: ExportFormat
): Promise<RenderedSlide[]> {
  const { width: canvasWidth, height: canvasHeight, slideWidth, slideHeight } =
    getTotalCanvasSize(slideCount, aspectRatio);

  const masterCanvas = document.createElement("canvas");
  masterCanvas.width = canvasWidth;
  masterCanvas.height = canvasHeight;

  const ctx = masterCanvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const { dx, dy, dw, dh } = getImageDrawRect(
    image.naturalWidth,
    image.naturalHeight,
    canvasWidth,
    canvasHeight,
    framing
  );

  ctx.drawImage(image, dx, dy, dw, dh);

  const slides: RenderedSlide[] = [];

  for (let i = 0; i < slideCount; i++) {
    const slideCanvas = document.createElement("canvas");
    slideCanvas.width = slideWidth;
    slideCanvas.height = slideHeight;

    const slideCtx = slideCanvas.getContext("2d");
    if (!slideCtx) throw new Error("Canvas is not supported in this browser.");

    slideCtx.imageSmoothingEnabled = true;
    slideCtx.imageSmoothingQuality = "high";

    slideCtx.drawImage(
      masterCanvas,
      i * slideWidth,
      0,
      slideWidth,
      slideHeight,
      0,
      0,
      slideWidth,
      slideHeight
    );

    const blob = await canvasToBlob(slideCanvas, format);
    const dataUrl = slideCanvas.toDataURL(
      format === "png" ? "image/png" : "image/jpeg",
      0.95
    );

    slides.push({
      index: i + 1,
      dataUrl,
      blob,
      width: slideWidth,
      height: slideHeight,
    });
  }

  return slides;
}

export function renderMasterPreviewDataUrl(
  image: HTMLImageElement,
  slideCount: SlideCount,
  aspectRatio: AspectRatio,
  framing: FramingState,
  maxWidth = 900
): string {
  const { width: canvasWidth, height: canvasHeight } = getTotalCanvasSize(
    slideCount,
    aspectRatio
  );

  const scale = Math.min(1, maxWidth / canvasWidth);
  const previewWidth = Math.round(canvasWidth * scale);
  const previewHeight = Math.round(canvasHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = previewWidth;
  canvas.height = previewHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const { dx, dy, dw, dh } = getImageDrawRect(
    image.naturalWidth,
    image.naturalHeight,
    canvasWidth,
    canvasHeight,
    framing
  );

  ctx.drawImage(
    image,
    dx * scale,
    dy * scale,
    dw * scale,
    dh * scale
  );

  return canvas.toDataURL("image/jpeg", 0.85);
}
