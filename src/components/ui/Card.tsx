import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-border bg-white/90 p-6 shadow-soft backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
