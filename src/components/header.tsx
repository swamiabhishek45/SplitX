import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { XProfileLink } from "@/components/x-profile-link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <Logo className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-tight">SplitX</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <XProfileLink />
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/editor">Split an image →</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
