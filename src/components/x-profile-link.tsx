import Link from "next/link";
import { cn } from "@/lib/utils";

const X_PROFILE_URL = "https://x.com/swamiabhishek45";
const X_HANDLE = "@swamiabhishek45";

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

export function XProfileLink({
  className,
  showHandle = false,
}: {
  className?: string;
  showHandle?: boolean;
}) {
  return (
    <Link
      href={X_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      aria-label={`Follow ${X_HANDLE} on X`}
    >
      <XLogo className="h-4 w-4 shrink-0" />
      {showHandle && (
        <span className="text-xs font-medium sm:text-sm">{X_HANDLE}</span>
      )}
    </Link>
  );
}
