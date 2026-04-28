import { AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Loader as Spinner } from "@/components/ui/Loader";

export default function App() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="grid min-h-[60vh] place-items-center">
            <Spinner />
          </div>
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <div key={location.pathname}>{outlet}</div>
        </AnimatePresence>
      </Suspense>
    </AppShell>
  );
}
