import { cn } from "@/lib/utils";

interface BadgeProps {
  children: string;
  tone?: "neutral" | "success" | "warning";
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        tone === "neutral" && "bg-surface text-foreground",
        tone === "success" && "bg-success/12 text-success",
        tone === "warning" && "bg-warning/15 text-[#9a5800]",
        className
      )}
    >
      {children}
    </span>
  );
}
