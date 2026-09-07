import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { XProfileLink } from "@/components/x-profile-link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 transition-opacity hover:opacity-80 sm:gap-2.5"
        >
          <Logo className="h-6 w-6 shrink-0" />
          <span className="truncate text-sm font-semibold tracking-tight">
            SplitX
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          <XProfileLink />
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="px-2 sm:px-4" asChild>
            <Link href="/editor">
              <span className="sm:hidden">Split</span>
              <span className="hidden sm:inline">Split an image →</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
