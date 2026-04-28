import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <PageTransition>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <EmptyState
            title="That page has gone missing"
            description="Try a dashboard search, head back home, or return to your current session."
            action={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" onClick={() => void navigate(user ? "/dashboard" : "/")}>
                  {user ? "Back to dashboard" : "Back home"}
                </Button>
                <Button onClick={() => void navigate(-1)}>Go back</Button>
              </div>
            }
          />

          <Card>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                void navigate(`/dashboard?search=${encodeURIComponent(search)}`);
              }}
            >
              <Input
                ref={inputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for an item or location"
                aria-label="Search from not found page"
              />
              <Button type="submit">Search dashboard</Button>
            </form>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}
