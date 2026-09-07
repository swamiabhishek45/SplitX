import JSZip from "jszip";
import type { ExportFormat, RenderedSlide } from "./types";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadSlide(slide: RenderedSlide, format: ExportFormat) {
  const ext = format === "png" ? "png" : "jpg";
  downloadBlob(slide.blob, `splitx-${slide.index}.${ext}`);
}

export async function downloadAllSlides(
  slides: RenderedSlide[],
  format: ExportFormat
) {
  const zip = new JSZip();
  const ext = format === "png" ? "png" : "jpg";

  slides.forEach((slide) => {
    zip.file(`splitx-${slide.index}.${ext}`, slide.blob);
  });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, "splitx-slides.zip");
}
