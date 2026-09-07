"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RotateCcw, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase = "whole" | "splitting" | "split";

const PARTS = [0, 1, 2];
const CUT_DURATION = 620;
const GAP_PX = 6;

const DEMO_IMAGE = {
  src: "/demo-image.jpg",
  width: 1024,
  height: 768,
};

export function HeroSplitDemo() {
  const [phase, setPhase] = useState<Phase>("whole");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const startSplit = useCallback(() => {
    if (phase !== "whole") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setPhase("split");
      return;
    }

    setPhase("splitting");
    timerRef.current = setTimeout(() => setPhase("split"), CUT_DURATION);
  }, [phase]);

  const replay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("whole");
  }, []);

  const isSplit = phase === "split";
  const isCutting = phase === "splitting";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted/20">
      <div
        className="group relative bg-neutral-950"
        style={{ aspectRatio: `${DEMO_IMAGE.width} / ${DEMO_IMAGE.height}` }}
      >
        <div
          className="absolute inset-0 flex transition-[gap] duration-500 ease-out"
          style={{ gap: isSplit ? GAP_PX : 0 }}
        >
          {PARTS.map((part) => (
            <div
              key={part}
              className={cn(
                "relative h-full min-w-0 flex-1 overflow-hidden transition-[border-radius] duration-500 ease-out",
                isSplit ? "rounded-lg" : "rounded-none"
              )}
            >
              <div
                className="absolute inset-y-0 left-0 w-[300%]"
                style={{ transform: `translateX(-${(part * 100) / 3}%)` }}
              >
                <Image
                  src={DEMO_IMAGE.src}
                  alt={
                    part === 0
                      ? "A wide screenshot split into three slides for X"
                      : ""
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  draggable={false}
                />
              </div>

              <span
                className={cn(
                  "absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] font-semibold text-white backdrop-blur-sm transition-all duration-300",
                  isSplit
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-1 opacity-0"
                )}
                aria-hidden={!isSplit}
              >
                {part + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[1, 2].map((line) => (
            <div
              key={line}
              className={cn(
                "absolute top-0 h-full w-0.5 origin-top bg-white/85 transition-all ease-out",
                phase === "whole" && "scale-y-0 opacity-0 duration-200",
                isCutting && "scale-y-100 opacity-100 duration-500",
                isSplit && "scale-y-100 opacity-0 duration-300"
              )}
              style={{
                left: `calc(${(line * 100) / 3}% - 1px)`,
                transitionDelay: isCutting ? `${(line - 1) * 90}ms` : "0ms",
              }}
            />
          ))}
        </div>

        {phase === "whole" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <Button
              onClick={startSplit}
              className="bg-black/85 text-white shadow-lg hover:bg-black"
            >
              <Scissors className="h-4 w-4" />
              Split it
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <p className="text-sm text-muted-foreground">
          {isSplit
            ? "Three equal parts. On X they scroll as one picture."
            : "This is the whole image. Try it."}
        </p>

        {isSplit ? (
          <Button variant="ghost" size="sm" onClick={replay}>
            <RotateCcw className="h-3.5 w-3.5" />
            Replay
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={startSplit}
            disabled={isCutting}
          >
            <Scissors className="h-3.5 w-3.5" />
            Split it
          </Button>
        )}
      </div>
    </div>
  );
}
