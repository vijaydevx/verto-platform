import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  CircleCheck,
  Clock3,
  Filter,
  HeartHandshake,
  MapPin,
  Megaphone,
  Music,
  Music2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Input } from "@/components/ui/Input";
import { PageTransition } from "@/components/layout/PageTransition";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useItems } from "@/hooks/useItems";
import { useDebounce } from "@/hooks/useDebounce";


type ItemTypeFilter = "all" | "lost" | "found";
type CategoryFilter = "all" | "bags" | "electronics" | "accessories" | "documents" | "bottles" | "others";
type SortFilter = "latest" | "oldest";

type DashboardItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: "lost" | "found";
  imageUrl: string;
  createdAt: string;
  isActive: boolean;
  ownerName: string;
};

type ExampleRecentItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: "lost" | "found";
  imageUrl: string;
  fallbackImageUrl: string;
  timeLabel: string;
};

const categoryLabels: Record<CategoryFilter, string> = {
  all: "All Categories",
  bags: "Bags",
  electronics: "Electronics",
  accessories: "Accessories",
  documents: "Documents",
  bottles: "Bottles",
  others: "Others",
};

const exampleRecentItems: ExampleRecentItem[] = [
  {
    id: "example-airpods",
    title: "Apple AirPods",
    description: "Found near the study tables in the library.",
    location: "Library, 2nd Floor",
    type: "found",
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a415522316f8?auto=format&fit=crop&w=1000&q=80",
    fallbackImageUrl: "https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=1000&q=80",
    timeLabel: "2h ago",
  },
  {
    id: "example-wallet",
    title: "Black Wallet",
    description: "Lost during the lab session. Contains ID cards.",
    location: "Engineering Block, Room 201",
    type: "lost",
    imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80",
    fallbackImageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80",
    timeLabel: "5h ago",
  },
  {
    id: "example-bottle",
    title: "Steel Water Bottle",
    description: "Found in the cafeteria near the billing counter.",
    location: "Cafeteria",
    type: "found",
    imageUrl: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=1000&q=80",
    fallbackImageUrl: "https://images.unsplash.com/photo-1550505095-81378a674395?auto=format&fit=crop&w=1000&q=80",
    timeLabel: "1d ago",
  },
  {
    id: "example-backpack",
    title: "Grey Backpack",
    description: "Lost near the main gate in the evening.",
    location: "Main Gate",
    type: "lost",
    imageUrl: "https://images.unsplash.com/photo-1514474959185-1472d4c4e0b6?auto=format&fit=crop&w=1000&q=80",
    fallbackImageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    timeLabel: "1d ago",
  },
];

const heroImageSources = [
  "/campus-hero-illustration.png",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80",
];

const fallbackImages = {
  all: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  electronics: "https://images.unsplash.com/photo-1585386959984-a415522316f8?auto=format&fit=crop&w=1000&q=80",
  bags: "https://images.unsplash.com/photo-1514474959185-1472d4c4e0b6?auto=format&fit=crop&w=1000&q=80",
  accessories: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80",
  bottles: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=1000&q=80",
  documents: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80",
  others: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
};

function inferCategory(item: Pick<DashboardItem, "title" | "description">): CategoryFilter {
  const text = `${item.title} ${item.description}`.toLowerCase();

  if (/airpod|earbud|phone|laptop|charger|tablet|electronics|headphone/.test(text)) {
    return "electronics";
  }
  if (/bag|backpack|wallet|pouch|luggage/.test(text)) {
    return "bags";
  }
  if (/watch|ring|chain|key|card holder|accessor/.test(text)) {
    return "accessories";
  }
  if (/id|document|certificate|book|notebook|paper|passport/.test(text)) {
    return "documents";
  }
  if (/bottle|flask|tumbler/.test(text)) {
    return "bottles";
  }

  return "others";
}

function getDisplayImage(item: DashboardItem): string {
  if (item.imageUrl?.trim()) {
    return item.imageUrl;
  }

  const category = inferCategory(item);
  return fallbackImages[category];
}

function formatRelativeTime(dateInput: string): string {
  const now = Date.now();
  const date = new Date(dateInput).getTime();
  if (Number.isNaN(date)) {
    return "recently";
  }

  const diff = Math.max(0, now - date);
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 60) return `${mins || 1}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ResilientImage({
  sources,
  alt,
  className,
}: {
  sources: string[];
  alt: string;
  className: string;
}) {
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [sources.join("|")]);

  const safeIndex = Math.min(sourceIndex, Math.max(0, sources.length - 1));
  const currentSource = sources[safeIndex] ?? "";

  return (
    <img
      src={currentSource}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        setSourceIndex((current) => (current < sources.length - 1 ? current + 1 : current));
      }}
      className={className}
    />
  );
}

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 700;
    const from = displayValue;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (value - from) * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <>{displayValue}</>;
}

function ItemCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-black/5 p-3">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="mt-3 h-4 w-28" />
      <Skeleton className="mt-2 h-7 w-40" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-3/4" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </Card>
  );
}

const BACKGROUND_MUSIC_URL = "/music.mp3";

export function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ItemTypeFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortFilter>("latest");
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [showMusicTooltip, setShowMusicTooltip] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const query = useItems({
    page: 1,
    type: filterType,
    q: debouncedSearch,
    category: category,
    sort: sortBy,
    includeArchived: false, // Default to false for live feed
  });


  useEffect(() => {
    if (query.error) {
      showToast({
        variant: "error",
        title: "Unable to load dashboard items",
        description: query.error.message,
      });
    }
  }, [query.error, showToast]);

  const allItems = useMemo<DashboardItem[]>(() => {
    return (query.data?.items ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      type: item.type,
      imageUrl: item.image_url,
      createdAt: item.created_at,
      isActive: item.is_active,
      ownerName: item.profiles?.full_name ?? "Campus member",
    }));
  }, [query.data?.items]);

  const activeItems = useMemo(() => allItems.filter((item) => item.isActive), [allItems]);

  const filteredItems = useMemo(() => {
    return allItems;
  }, [allItems]);


  const stats = useMemo(() => {
    const found = allItems.filter((item) => item.type === "found").length;
    const lost = allItems.filter((item) => item.type === "lost").length;
    const resolved = allItems.filter((item) => !item.isActive).length;
    return { found, lost, resolved };
  }, [allItems]);

  const toggleSaved = (itemId: string) => {
    setSavedItems((current) => {
      const next = new Set(current);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const toggleMusic = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(BACKGROUND_MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }

    try {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      showToast({
        variant: "error",
        title: "Unable to play music",
        description: "Please try clicking the button again.",
      });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMusicMuted;
      setIsMusicMuted(!isMusicMuted);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setCategory("all");
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1500px] px-4 pb-12 pt-8 sm:px-6 lg:px-8" style={{ backgroundColor: "#F8F9FA" }}>
<motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mb-6 overflow-hidden rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_30px_-24px_rgba(0,0,0,0.45)] lg:p-8"
    >
      <div className="mb-4 flex items-center justify-end gap-2">
        <div
          className="relative"
          onMouseEnter={() => setShowMusicTooltip(true)}
          onMouseLeave={() => setShowMusicTooltip(false)}
        >
          <button
            type="button"
            onClick={toggleMusic}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isMusicPlaying
                ? "border-[#2E7D5B]/40 bg-[#2E7D5B]/10 text-[#2E7D5B]"
                : "border-black/10 bg-white text-slate-600 hover:text-[#2E7D5B]"
            }`}
            aria-label={isMusicPlaying ? "Pause background music" : "Play background music"}
          >
            {isMusicPlaying ? (
              <>
                <Music2 className="h-4 w-4" />
                <span>Music On</span>
              </>
            ) : (
              <>
                <Music className="h-4 w-4" />
                <span>Music Off</span>
              </>
            )}
          </button>
          {showMusicTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg"
            >
              {isMusicPlaying ? "Click to pause music" : "Click to play music"}
              <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-slate-800" />
            </motion.div>
          )}
        </div>

        {isMusicPlaying && (
          <button
            type="button"
            onClick={toggleMute}
            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-slate-600 transition hover:text-[#2E7D5B]"
            aria-label={isMusicMuted ? "Unmute music" : "Mute music"}
          >
            {isMusicMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2E7D5B]">Live Feed</p>
              <h1 className="mt-3 text-5xl font-black tracking-tight text-[#101828] md:text-6xl">
                Campus <span className="font-serif italic text-[#2E7D5B]">sanctuary.</span>
              </h1>
              <p className="mt-4 max-w-xl text-xl font-medium leading-relaxed text-slate-500">
                Browse recent lost and found reports from your verified campus community.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-[#2E7D5B] px-7 font-bold text-white hover:bg-[#25664a]"
                  onClick={() => void navigate("/post")}
                >
                  <Megaphone className="h-4 w-4" />
                  Report an item
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 rounded-full border border-black/10 bg-white px-7 font-semibold text-slate-700"
                  onClick={() =>
                    window.scrollTo({
                      top: Math.max(document.documentElement.clientHeight, 600),
                      behavior: "smooth",
                    })
                  }
                >
                  <Sparkles className="h-4 w-4" />
                  How it works
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-[#2E7D5B]/10 blur-3xl" />
              <ResilientImage
                sources={heroImageSources}
                alt="Campus"
                className="aspect-[16/8] w-full rounded-2xl border border-black/10 object-cover"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.55, ease: "easeOut" }}
          className="mb-6 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_14px_28px_-24px_rgba(0,0,0,0.45)] lg:p-6"
        >
          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_0.9fr_auto] lg:items-end">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Find by Location</p>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by item, location, or keyword"
                  className="h-12 rounded-xl border-black/10 bg-[#FAFAFA] pl-11 text-sm"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Filter Type</p>
              <div className="inline-flex rounded-xl border border-black/10 bg-[#FAFAFA] p-1">
                {(["all", "lost", "found"] as ItemTypeFilter[]).map((value) => {
                  const active = filterType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilterType(value)}
                      className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition ${
                        active ? "bg-[#2E7D5B] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Category</p>
              <div className="relative">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as CategoryFilter)}
                  className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-[#FAFAFA] px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2E7D5B]"
                >
                  {(Object.keys(categoryLabels) as CategoryFilter[]).map((key) => (
                    <option key={key} value={key}>
                      {categoryLabels[key]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-xl border border-black/10 bg-[#FAFAFA] text-slate-600 transition hover:scale-[1.03] hover:text-[#2E7D5B]"
              aria-label="Advanced filters"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55, ease: "easeOut" }}
          className="mb-6 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_14px_28px_-24px_rgba(0,0,0,0.45)] lg:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Recent Items</h2>
            <span className="rounded-full bg-[#2E7D5B]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#2E7D5B]">
              Example
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {exampleRecentItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-2xl border border-black/5 bg-white p-3 shadow-[0_12px_24px_-20px_rgba(0,0,0,0.45)] transition"
              >
                <div className="relative">
                  <ResilientImage
                    sources={[item.imageUrl, item.fallbackImageUrl, item.type === "found" ? fallbackImages.electronics : fallbackImages.bags, fallbackImages.all]}
                    alt={item.title}
                    className="h-40 w-full rounded-xl object-cover"
                  />
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${
                      item.type === "found" ? "bg-[#2E7D5B] text-white" : "bg-[#ef4444] text-white"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#2E7D5B]">
                  <MapPin className="h-3.5 w-3.5" />
                  {item.location}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{item.description}</p>

                <div className="mt-4 border-t border-black/5 pt-3">
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    {item.timeLabel}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
            className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_14px_28px_-24px_rgba(0,0,0,0.45)] lg:p-6"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Live Campus Feed</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">Sort by</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortFilter)}
                    className="h-10 appearance-none rounded-xl border border-black/10 bg-white px-4 pr-9 text-sm font-semibold text-slate-700"
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-slate-500 transition hover:text-[#2E7D5B]"
                  aria-label="Grid options"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {query.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ItemCardSkeleton key={index} />
                ))}
              </div>
            ) : null}

            {!query.isLoading && query.isError ? <ErrorState onRetry={() => void query.refetch()} /> : null}

            {!query.isLoading && !query.isError && filteredItems.length === 0 ? (
              <EmptyState
                title="Silence in the sanctuary"
                description="No items match this search. Try adjusting location, type, or category filters."
                action={
                  <Button variant="secondary" className="rounded-full" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            ) : null}

            {!query.isLoading && !query.isError && filteredItems.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {filteredItems.map((item, index) => {
                  const saved = savedItems.has(item.id);
                  const avatarSource = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.ownerName)}&background=2E7D5B&color=ffffff&size=64`;

                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                      whileHover={{ y: -8, scale: 1.01 }}
                      className="group cursor-pointer rounded-2xl border border-black/5 bg-white p-3 shadow-[0_12px_24px_-20px_rgba(0,0,0,0.45)] transition"
                      onClick={() => void navigate(`/item/${item.id}`)}
                    >
                      <div className="relative">
                        <ResilientImage
                          sources={[getDisplayImage(item), fallbackImages[inferCategory(item)], fallbackImages.all]}
                          alt={item.title}
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        <span
                          className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${
                            item.type === "found" ? "bg-[#2E7D5B] text-white" : "bg-[#ef4444] text-white"
                          }`}
                        >
                          {item.type}
                        </span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleSaved(item.id);
                          }}
                          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg border border-white/80 bg-white/95 text-slate-600 transition hover:text-[#2E7D5B]"
                          aria-label={saved ? "Remove bookmark" : "Save item"}
                        >
                          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="mt-3">
                        <p className="flex items-center gap-1 text-xs font-semibold text-[#2E7D5B]">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.location}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{item.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3">
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatRelativeTime(item.createdAt)}
                        </span>
                        <div className="flex items-center">
                          <img src={avatarSource} alt={item.ownerName} className="h-7 w-7 rounded-full border border-white" />
                          <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                            alt="member"
                            className="-ml-2 h-7 w-7 rounded-full border border-white"
                          />
                          <span className="ml-2 text-xs font-semibold text-slate-400">+{(index % 9) + 3}</span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : null}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55, ease: "easeOut" }}
            className="space-y-4"
          >
            <Card className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_24px_-22px_rgba(0,0,0,0.45)]">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                <Users className="h-4 w-4 text-[#2E7D5B]" />
                Community at a glance
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-[#2E7D5B]/8 p-3">
                  <p className="text-2xl font-black text-slate-900">
                    <AnimatedCounter value={stats.found} />
                  </p>
                  <p className="text-xs font-semibold text-slate-500">Items Found</p>
                </div>
                <div className="rounded-xl bg-[#ef4444]/8 p-3">
                  <p className="text-2xl font-black text-slate-900">
                    <AnimatedCounter value={stats.lost} />
                  </p>
                  <p className="text-xs font-semibold text-slate-500">Items Lost</p>
                </div>
                <div className="rounded-xl bg-[#f59e0b]/10 p-3">
                  <p className="text-2xl font-black text-slate-900">
                    <AnimatedCounter value={stats.resolved} />
                  </p>
                  <p className="text-xs font-semibold text-slate-500">Resolved</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_24px_-22px_rgba(0,0,0,0.45)]">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-[#2E7D5B]" />
                Safety tips
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CircleCheck className="mt-0.5 h-4 w-4 text-[#2E7D5B]" />
                  Always double-check your belongings.
                </li>
                <li className="flex items-start gap-2">
                  <CircleCheck className="mt-0.5 h-4 w-4 text-[#2E7D5B]" />
                  Report items as soon as possible.
                </li>
                <li className="flex items-start gap-2">
                  <CircleCheck className="mt-0.5 h-4 w-4 text-[#2E7D5B]" />
                  Meet in safe, public places.
                </li>
              </ul>
              <button type="button" className="mt-3 text-sm font-bold text-[#2E7D5B] transition hover:text-[#235742]">
                View all tips
              </button>
            </Card>

            <Card className="rounded-2xl border border-[#2E7D5B]/20 bg-[#2E7D5B]/8 p-5 shadow-[0_12px_24px_-22px_rgba(0,0,0,0.45)]">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <HeartHandshake className="h-5 w-5 text-[#2E7D5B]" />
                Make a difference
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Help your fellow students by reporting items you find on campus.
              </p>
              <Button className="mt-4 h-10 rounded-full bg-[#2E7D5B] px-5 font-bold text-white hover:bg-[#245f45]" onClick={() => void navigate("/post")}>
                Report an item
              </Button>
            </Card>
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55, ease: "easeOut" }}
          className="mt-6 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_12px_24px_-22px_rgba(0,0,0,0.45)] sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Bell className="h-4 w-4 text-[#2E7D5B]" />
                Get notified instantly
              </p>
              <p className="mt-1 text-sm text-slate-500">Never miss an update about your items.</p>
            </div>

            <button
              type="button"
              onClick={() => setNotificationsEnabled((current) => !current)}
              className="inline-flex items-center gap-3 rounded-full border border-black/10 px-4 py-2 transition hover:border-[#2E7D5B]/40"
              aria-pressed={notificationsEnabled}
            >
              <span className="text-sm font-semibold text-slate-700">
                {notificationsEnabled ? "Notifications enabled" : "Enable notifications"}
              </span>
              <span
                className={`relative h-7 w-12 rounded-full transition ${
                  notificationsEnabled ? "bg-[#2E7D5B]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    notificationsEnabled ? "left-6" : "left-1"
                  }`}
                />
              </span>
            </button>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
