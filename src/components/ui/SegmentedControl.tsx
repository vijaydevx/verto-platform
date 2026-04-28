import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  label?: string;
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  className
}: SegmentedControlProps<T>) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-semibold text-foreground">{label}</p>}
      <div
        className="inline-flex rounded-full bg-surface p-1 ring-1 ring-border"
        role="radiogroup"
        aria-label={label}
      >
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
