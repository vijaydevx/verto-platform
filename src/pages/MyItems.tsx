import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemTabs } from "@/components/items/ItemTabs";
import { PageTransition } from "@/components/layout/PageTransition";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useArchiveItem, useMyItems, useRestoreItem } from "@/hooks/useItems";
import { formatDate } from "@/lib/utils";

type TabValue = "active" | "archived" | "all";



export function MyItemsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<TabValue>("active");
  const [pendingUndo, setPendingUndo] = useState<{ id: string; title: string } | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const itemsQuery = useMyItems({
    userId: user?.id,
    includeArchived: true,
    page: 1,
  });
  const archiveMutation = useArchiveItem();
  const restoreMutation = useRestoreItem();

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) {
        window.clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  const visibleItems = useMemo(() => {
    const items = itemsQuery.data?.items ?? [];

    if (tab === "active") {
      return items.filter((item) => item.is_active);
    }

    if (tab === "archived") {
      return items.filter((item) => !item.is_active);
    }

    return items;
  }, [itemsQuery.data?.items, tab]);

  const archiveWithUndo = async (id: string, title: string) => {
    try {
      await archiveMutation.mutateAsync(id);

      if (undoTimerRef.current) {
        window.clearTimeout(undoTimerRef.current);
      }

      setPendingUndo({ id, title });
      undoTimerRef.current = window.setTimeout(() => {
        setPendingUndo(null);
      }, 3000);

      showToast({
        variant: "success",
        title: "Item archived",
        description: "You have 3 seconds to undo this action.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to archive the item.";
      showToast({
        variant: "error",
        title: "Archive failed",
        description: message,
      });
    }
  };

  const undoArchive = async () => {
    if (!pendingUndo) {
      return;
    }

    try {
      await restoreMutation.mutateAsync(pendingUndo.id);
      showToast({
        variant: "success",
        title: "Archive undone",
        description: `${pendingUndo.title} is active again.`,
      });
      setPendingUndo(null);
      if (undoTimerRef.current) {
        window.clearTimeout(undoTimerRef.current);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to restore the item.";
      showToast({
        variant: "error",
        title: "Undo failed",
        description: message,
      });
    }
  };


  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">My Items</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground">
              Manage reports
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Review active posts and restore archived ones.
            </p>
          </div>
          <ItemTabs value={tab} onChange={setTab} />
        </div>

        {pendingUndo ? (
          <Card className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{pendingUndo.title}</span> was archived.
            </p>
            <Button variant="secondary" onClick={() => void undoArchive()}>
              Undo
            </Button>
          </Card>
        ) : null}

        <div className="mx-auto max-w-4xl space-y-5">
            {itemsQuery.isLoading ? (
              <Card className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-20 rounded-[24px]" />
                <Skeleton className="h-20 rounded-[24px]" />
                <Skeleton className="h-20 rounded-[24px]" />
              </Card>
            ) : null}

            {itemsQuery.isError ? <ErrorState onRetry={() => void itemsQuery.refetch()} /> : null}

            {!itemsQuery.isLoading && !itemsQuery.isError && visibleItems.length === 0 ? (
              <EmptyState
                title="No items in this view"
                description="Post a new report or switch tabs to review active and archived items."
                action={<Button onClick={() => void navigate("/post")}>Post an item</Button>}
              />
            ) : null}

            {!itemsQuery.isLoading && !itemsQuery.isError && visibleItems.length > 0 ? (
              <Card className="space-y-4">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[24px] border border-border bg-surface/35 p-4 sm:flex-row sm:items-center"
                  >
                    <img src={item.image_url} alt={item.title} className="h-24 w-full rounded-2xl object-cover sm:w-28" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
                        <Badge tone={item.type === "found" ? "success" : "warning"}>{item.type}</Badge>
                        {!item.is_active ? <Badge>archived</Badge> : null}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.location} • {formatDate(item.reported_date)}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={() => void navigate(`/item/${item.id}`)}>
                        View
                      </Button>
                      {item.is_active ? (
                        <Button variant="danger" onClick={() => void archiveWithUndo(item.id, item.title)}>
                          Archive
                        </Button>
                      ) : (
                        <Button variant="secondary" onClick={() => void restoreMutation.mutateAsync(item.id)}>
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
            ) : null}
          </div>
      </section>
    </PageTransition>
  );
}
