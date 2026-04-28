import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border bg-white px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:ring-4",
        error
          ? "border-danger focus:border-danger focus:ring-danger/15"
          : "border-border focus:border-primary focus:ring-primary/10",
        className,
      )}
      {...props}
    />
  );
});
