"use client";

import {
  Eye,
  EyeOff,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  ASPECT_RATIO_DESCRIPTIONS,
  ASPECT_RATIO_DIMENSIONS,
  type AspectRatio,
  type ExportFormat,
  type FramingState,
  type SlideCount,
} from "@/lib/types";

interface SegmentedControlProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex rounded-lg border border-border p-1">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
            value === option.value
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

interface SplitControlsProps {
  slideCount: SlideCount;
  aspectRatio: AspectRatio;
  format: ExportFormat;
  framing: FramingState;
  hideCropLines: boolean;
  onSlideCountChange: (count: SlideCount) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onFormatChange: (format: ExportFormat) => void;
  onFramingChange: (partial: Partial<FramingState>) => void;
  onResetFraming: () => void;
  onToggleCropLines: () => void;
  onRemoveImage: () => void;
}

export function SplitControls({
  slideCount,
  aspectRatio,
  format,
  framing,
  hideCropLines,
  onSlideCountChange,
  onAspectRatioChange,
  onFormatChange,
  onFramingChange,
  onResetFraming,
  onToggleCropLines,
  onRemoveImage,
}: SplitControlsProps) {
  const dims = ASPECT_RATIO_DIMENSIONS[aspectRatio];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">2. Slice it</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every slide comes out at exactly the same size, so the swipe stays
            seamless.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Number of slides</Label>
          <SegmentedControl
            options={[
              { value: 2 as SlideCount, label: "2 slides" },
              { value: 3 as SlideCount, label: "3 slides" },
              { value: 4 as SlideCount, label: "4 slides" },
            ]}
            value={slideCount}
            onChange={onSlideCountChange}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Slide shape</Label>
          <SegmentedControl
            options={(
              Object.keys(ASPECT_RATIO_DIMENSIONS) as AspectRatio[]
            ).map((ratio) => ({
              value: ratio,
              label: ratio,
            }))}
            value={aspectRatio}
            onChange={onAspectRatioChange}
          />
          <p className="text-xs text-muted-foreground">
            {ASPECT_RATIO_DESCRIPTIONS[aspectRatio]} — {dims.width} × {dims.height} px per slide
          </p>
          <p className="text-xs text-muted-foreground/80">
            All slides use identical dimensions so X doesn&apos;t crop them differently.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Zoom</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {framing.zoom}%
              </span>
            </div>
            <Slider
              value={[framing.zoom]}
              onValueChange={([v]) => onFramingChange({ zoom: v })}
              min={50}
              max={200}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Horizontal position
              </Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {framing.horizontal}%
              </span>
            </div>
            <Slider
              value={[framing.horizontal]}
              onValueChange={([v]) => onFramingChange({ horizontal: v })}
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Vertical position
              </Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {framing.vertical}%
              </span>
            </div>
            <Slider
              value={[framing.vertical]}
              onValueChange={([v]) => onFramingChange({ vertical: v })}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={onResetFraming}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset framing
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggleCropLines}>
            {hideCropLines ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            {hideCropLines ? "Show crop lines" : "Hide crop lines"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveImage}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove image
          </Button>
        </div>
      </section>

      <section className="space-y-2">
        <Label className="text-xs text-muted-foreground">Export format</Label>
        <SegmentedControl
          options={[
            { value: "png" as ExportFormat, label: "PNG" },
            { value: "jpeg" as ExportFormat, label: "JPEG" },
          ]}
          value={format}
          onChange={onFormatChange}
        />
        <p className="text-xs text-muted-foreground">
          PNG for sharp text. JPEG for smaller file size.
        </p>
      </section>
    </div>
  );
}
