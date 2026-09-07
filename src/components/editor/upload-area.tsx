"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SourceImage } from "@/lib/types";

interface UploadAreaProps {
  sourceImage: SourceImage | null;
  onFileSelect: (file: File) => void;
  onPasteError: () => void;
  errorMessage: string | null;
  onClearError: () => void;
}

export function UploadArea({
  sourceImage,
  onFileSelect,
  onPasteError,
  errorMessage,
  onClearError,
}: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      onClearError();
      const file = files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect, onClearError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) {
        onPasteError();
        return;
      }

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            onClearError();
            onFileSelect(file);
            return;
          }
        }
      }
    },
    [onFileSelect, onClearError, onPasteError]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  if (sourceImage) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
            <img
              src={sourceImage.url}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{sourceImage.name}</p>
            <p className="text-xs text-muted-foreground">
              {sourceImage.width} × {sourceImage.height} px
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Replace
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all duration-200",
          isDragging
            ? "border-foreground bg-muted/50 scale-[1.01]"
            : "border-border hover:border-foreground/30 hover:bg-muted/20"
        )}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">Drop an image here</p>
        <p className="mt-1 text-xs text-muted-foreground">
          or click to choose one, or paste it
        </p>
        <p className="mt-3 text-xs text-muted-foreground/70">
          PNG, JPEG, or WebP
        </p>
      </div>

      {errorMessage && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

export function EmptyUploadState({
  onFileSelect,
  onPasteError,
  errorMessage,
  onClearError,
}: Omit<UploadAreaProps, "sourceImage">) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      onClearError();
      const file = files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect, onClearError]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) {
        onPasteError();
        return;
      }

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            onClearError();
            onFileSelect(file);
            return;
          }
        }
      }
    },
    [onFileSelect, onClearError, onPasteError]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full max-w-lg cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-16 transition-all duration-200",
          isDragging
            ? "border-foreground bg-muted/50"
            : "border-border hover:border-foreground/30 hover:bg-muted/20"
        )}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-base font-medium">Drop an image here</p>
        <p className="mt-2 text-sm text-muted-foreground">
          or click to choose one, or paste it
        </p>
        <p className="mt-4 text-xs text-muted-foreground/70">
          PNG, JPEG, or WebP
        </p>
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
