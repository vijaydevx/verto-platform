import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Users, 
  Search, 
  MapPin, 
  TrendingUp, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

interface Stats {
  totalUsers: number;
  totalItems: number;
  lostCount: number;
  foundCount: number;
  campusName: string;
}

export function CampusStatsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // 1. Fetch Campus Info
        const { data: campus, error: campusError } = await supabase
          .from("campuses")
          .select("id, name")
          .eq("slug", slug)
          .single();

        if (campusError || !campus) {
          throw new Error("Campus not found");
        }

        // 2. Fetch User count
        const { count: userCount, error: userError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("campus_id", campus.id);

        if (userError) throw userError;

        // 3. Fetch Lost items
        const { count: lostCount, error: lostError } = await supabase
          .from("items")
          .select("*", { count: "exact", head: true })
          .eq("campus_id", campus.id)
          .eq("type", "lost");

        if (lostError) throw lostError;

        // 4. Fetch Found items
        const { count: foundCount, error: foundError } = await supabase
          .from("items")
          .select("*", { count: "exact", head: true })
          .eq("campus_id", campus.id)
          .eq("type", "found");

        if (foundError) throw foundError;

        setStats({
          totalUsers: userCount || 0,
          totalItems: (lostCount || 0) + (foundCount || 0),
          lostCount: lostCount || 0,
          foundCount: foundCount || 0,
          campusName: campus.name
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    void fetchStats();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-danger" />
        <h2 className="mt-4 text-2xl font-bold">Stats unavailable</h2>
        <p className="mt-2 text-muted-foreground">{error ?? "We couldn't load the statistics for this campus."}</p>
        <Link to="/">
          <Button variant="secondary" className="mt-6">Back to Safety</Button>
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Live Insights</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground">
              {stats.campusName}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Real-time activity and recovery metrics for your campus community.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-success uppercase tracking-widest">Active</span>
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Verified users</p>
              <p className="text-4xl font-black">{stats.totalUsers}</p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-danger/10 p-3 text-danger">
                <Search className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Unrecovered (Lost)</p>
              <p className="text-4xl font-black">{stats.lostCount}</p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-success/10 p-3 text-success">
                <MapPin className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Recovered/Found</p>
              <p className="text-4xl font-black">{stats.foundCount}</p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-6 bg-slate-950 text-white">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-white/10 p-3 text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-white/70">Total interactions</p>
              <p className="text-4xl font-black">{stats.totalItems}</p>
            </div>
          </Card>
        </div>

        <div className="mt-10 rounded-3xl bg-surface p-8 text-center border border-border/40">
           <h3 className="text-xl font-bold">Campus Impact</h3>
           <p className="mx-auto mt-2 max-w-2xl text-muted-foreground italic">
             "VERTO helps bridge the gap between lost belongings and their owners through community cooperation."
           </p>
        </div>
      </div>
    </PageTransition>
  );
}
