import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Copy, MapPin, Share2, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/items/Breadcrumbs";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Lightbox } from "@/components/items/Lightbox";
import { PageTransition } from "@/components/layout/PageTransition";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  useArchiveItem, 
  useClaimItem, 
  useItem, 
  useComments, 
  useCreateComment 
} from "@/hooks/useItems";


import { formatDate } from "@/lib/utils";

export function ItemDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const query = useItem(id);
  const archiveItem = useArchiveItem();
  const claimItemMutation = useClaimItem();
  const { data: comments, isLoading: commentsLoading } = useComments(id || "");
  const createCommentMutation = useCreateComment();

  const [isClaiming, setIsClaiming] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);



  const item = query.data;
  const isOwner = useMemo(() => Boolean(item && user && item.user_id === user.id), [item, user]);

  const handleShare = async () => {
    if (!item) {
      return;
    }

    const url = window.location.href;
    const canUseWebShare = typeof navigator.share === "function";

    try {
      if (canUseWebShare) {
        await navigator.share({
          title: item.title,
          text: `${item.type.toUpperCase()}: ${item.title}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }

      showToast({
        variant: "success",
        title: "Link ready",
        description: canUseWebShare ? "The share sheet has been opened." : "The URL was copied to your clipboard.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to share the item.";
      showToast({
        variant: "error",
        title: "Share failed",
        description: message,
      });
    }
  };

  const handleArchive = async () => {
    if (!item) {
      return;
    }

    try {
      await archiveItem.mutateAsync(item.id);
      showToast({
        variant: "success",
        title: "Item archived",
        description: "The listing is now hidden from the active feed.",
      });
      void navigate("/my-items", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to archive the item.";
      showToast({
        variant: "error",
        title: "Archive failed",
        description: message,
      });
  const handleClaim = async () => {
    if (!item || !user) {
      showToast({ variant: "error", title: "Authentication required", description: "Please sign in to claim this item." });
      return;
    }

    const message = window.prompt(
      item.type === "found" 
        ? "Add a message to the person who found this. Mention identifying details to prove it's yours." 
        : "Add a message to the person who lost this. Tell them where they can collect it or how to meet."
    );

    if (message === null) return; // Cancelled

    setIsClaiming(true);
    try {
      await claimItemMutation.mutateAsync({
        itemId: item.id,
        userId: user.id,
        message: message || "I would like to claim this item."
      });

      showToast({
        variant: "success",
        title: "Claim submitted",
        description: "The poster has been notified. They will contact you via email or the platform.",
      });
    } catch (error: any) {
      showToast({
        variant: "error",
        title: "Claim failed",
        description: error.message || "Unable to submit your claim.",
      });
    } finally {
      setIsClaiming(false);
    }
  };


  const handlePostComment = async () => {
    if (!user || !item || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await createCommentMutation.mutateAsync({
        itemId: item.id,
        userId: user.id,
        content: commentText.trim()
      });
      setCommentText("");
      showToast({ variant: "success", title: "Comment posted" });
    } catch (error: any) {
      showToast({ variant: "error", title: "Failed to post comment", description: error.message });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (query.isLoading) {

    return (
      <PageTransition>
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-[380px] rounded-[32px]" />
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <Skeleton className="h-64 rounded-[32px]" />
              <Skeleton className="h-64 rounded-[32px]" />
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  if (query.isError) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <ErrorState onRetry={() => void query.refetch()} />
        </section>
      </PageTransition>
    );
  }

  if (!item || (!item.is_active && !isOwner)) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <EmptyState
            title="This item is no longer available"
            description="It may have been archived or removed from the active campus feed."
            action={
              <Link to="/dashboard">
                <Button variant="secondary">Back to dashboard</Button>
              </Link>
            }
          />
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Breadcrumbs items={[{ label: "Dashboard", to: "/dashboard" }, { label: item.title }]} />

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <button
                type="button"
                className="block w-full overflow-hidden rounded-[32px] border border-border bg-white shadow-soft"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open image in lightbox"
              >
                <img src={item.image_url} alt={item.title} className="aspect-[16/10] w-full object-cover" />
              </button>

              <Card>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone={item.type === "found" ? "success" : "warning"}>{item.type}</Badge>
                      {!item.is_active ? <Badge>archived</Badge> : null}
                    </div>
                    <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={() => void handleShare()}>
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        void navigator.clipboard.writeText(window.location.href).then(() => {
                          showToast({
                            variant: "success",
                            title: "Copied to clipboard",
                          });
                        })
                      }
                    >
                      <Copy className="h-4 w-4" />
                      Copy link
                    </Button>
                    {!isOwner && item.is_active ? (
                      <Button 
                        variant="primary" 
                        onClick={() => void handleClaim()}
                        loading={isClaiming}
                        className="bg-[#2E7D5B] hover:bg-[#1B5E3B] text-white"
                      >
                        {item.type === "found" ? "This is mine" : "I found this"}
                      </Button>
                    ) : null}
                    {isOwner && item.is_active ? (
                      <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                        Archive
                      </Button>
                    ) : null}

                  </div>
                </div>

                <p className="mt-6 text-base leading-8 text-muted-foreground">{item.description}</p>
              </Card>
            </div>

              {/* Comments Section */}
              <Card className="mt-8">
                <h2 className="text-xl font-bold text-foreground mb-6">Discussion</h2>
                
                <div className="space-y-6 mb-8">
                  {commentsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full rounded-2xl" />
                      <Skeleton className="h-20 w-full rounded-2xl" />
                    </div>
                  ) : comments && comments.length > 0 ? (
                    comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-[#2E7D5B]/10 flex items-center justify-center text-[#2E7D5B] font-bold text-sm shrink-0">
                          {comment.profiles?.full_name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-slate-900">{comment.profiles?.full_name || "Campus member"}</span>
                            <span className="text-xs text-slate-400">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-sm text-slate-400 font-medium">No comments yet. Start the conversation!</p>
                    </div>
                  )}
                </div>

                {user ? (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Add a comment or ask a question..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-[#2E7D5B] focus:ring-0 outline-none transition-colors font-medium text-slate-900 placeholder:text-slate-400 resize-none min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handlePostComment}
                        disabled={!commentText.trim() || isSubmittingComment}
                        className="bg-[#2E7D5B] hover:bg-[#1B5E3B] text-white px-8 rounded-full"
                      >
                        Post Comment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-100">
                    <p className="text-sm text-slate-600 mb-4">Please sign in to join the discussion.</p>
                    <Link to="/auth/login">
                      <Button variant="secondary" className="rounded-full">Sign In</Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">

                <h2 className="text-lg font-bold text-foreground">Details</h2>
                <div className="mt-5 space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-foreground">Location</p>
                      <p>{item.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Reported date</p>
                    <p>{formatDate(item.reported_date)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Posted on</p>
                    <p>{formatDate(item.created_at)}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-bold text-foreground">Contact</h2>
                <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">Posted by</p>
                    <p>{item.profiles?.full_name ?? "Campus member"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Campus email</p>
                    <a href={`mailto:${item.profiles?.campus_email}`} className="text-primary transition hover:text-primary/80">
                      {item.profiles?.campus_email ?? "Unavailable"}
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Lightbox open={lightboxOpen} imageUrl={item.image_url} alt={item.title} onClose={() => setLightboxOpen(false)} />
        <ConfirmDialog
          open={confirmOpen}
          title="Archive this item?"
          description="This performs a soft delete by setting the item inactive. You can restore it later from My Items."
          confirmLabel="Archive item"
          confirmVariant="danger"
          loading={archiveItem.isPending}
          onConfirm={() => void handleArchive()}
          onClose={() => setConfirmOpen(false)}
        />
      </section>
    </PageTransition>
  );
}
