import { Logo } from "@/components/logo";
import { XProfileLink } from "@/components/x-profile-link";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span className="font-medium text-foreground">SplitX</span>
        </div>
        <p>Turn one image into a seamless X carousel.</p>
        <XProfileLink />
      </div>
    </footer>
  );
}
