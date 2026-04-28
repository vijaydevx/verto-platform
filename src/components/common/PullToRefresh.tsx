import { useRef, useState, type PropsWithChildren, type TouchEvent } from "react";

interface PullToRefreshProps extends PropsWithChildren {
  onRefresh: () => Promise<unknown>;
  disabled?: boolean;
}

export function PullToRefresh({ children, onRefresh, disabled }: PullToRefreshProps) {
  const startY = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (disabled || window.scrollY > 0) {
      return;
    }

    startY.current = event.touches[0]?.clientY ?? null;
  };

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (disabled || startY.current === null) {
      return;
    }

    const currentY = event.touches[0]?.clientY ?? startY.current;
    const distance = Math.max(0, Math.min(120, currentY - startY.current));
    setPullDistance(distance);
  };

  const onTouchEnd = () => {
    if (disabled) {
      return;
    }

    const shouldRefresh = pullDistance > 80;
    setPullDistance(0);
    startY.current = null;

    if (!shouldRefresh || refreshing) {
      return;
    }

    setRefreshing(true);
    void onRefresh().finally(() => {
      setRefreshing(false);
    });
  };

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div
        className="flex items-center justify-center overflow-hidden text-sm text-muted-foreground transition-[height] duration-200"
        style={{ height: pullDistance ? Math.max(24, pullDistance / 2) : 0 }}
        aria-live="polite"
      >
        {refreshing ? "Refreshing feed..." : pullDistance > 80 ? "Release to refresh" : "Pull to refresh"}
      </div>
      {children}
    </div>
  );
}
