import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={48}
      height={48}
      priority
      className={cn(
        "rounded-md bg-black object-contain ring-1 ring-black/10 dark:ring-white/15",
        className
      )}
    />
  );
}
