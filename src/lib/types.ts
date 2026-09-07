export type AspectRatio = "3:4" | "4:5" | "1:1" | "16:9";
export type SlideCount = 2 | 3 | 4;
export type ExportFormat = "png" | "jpeg";

export const ASPECT_RATIO_DIMENSIONS: Record<
  AspectRatio,
  { width: number; height: number; label: string }
> = {
  "3:4": { width: 1200, height: 1600, label: "3:4" },
  "4:5": { width: 1080, height: 1350, label: "4:5" },
  "1:1": { width: 1200, height: 1200, label: "1:1" },
  "16:9": { width: 1920, height: 1080, label: "16:9" },
};

export const ASPECT_RATIO_DESCRIPTIONS: Record<AspectRatio, string> = {
  "3:4": "Biggest display on X — 1200 × 1600 px",
  "4:5": "Tall portrait — 1080 × 1350 px",
  "1:1": "Square — 1200 × 1200 px",
  "16:9": "Wide — 1920 × 1080 px",
};

export interface FramingState {
  zoom: number;
  horizontal: number;
  vertical: number;
}

export interface SplitSettings {
  slideCount: SlideCount;
  aspectRatio: AspectRatio;
  framing: FramingState;
  format: ExportFormat;
}

export interface SourceImage {
  file: File;
  url: string;
  width: number;
  height: number;
  name: string;
}

export interface RenderedSlide {
  index: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export const DEFAULT_FRAMING: FramingState = {
  zoom: 100,
  horizontal: 50,
  vertical: 50,
};

export const DEFAULT_SETTINGS: SplitSettings = {
  slideCount: 3,
  aspectRatio: "3:4",
  framing: DEFAULT_FRAMING,
  format: "png",
};

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const MAX_IMAGE_DIMENSION = 16384;
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
