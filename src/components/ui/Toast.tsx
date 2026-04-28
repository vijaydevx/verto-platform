import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "loading";

interface ToastRecord {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastRecord, "id">) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  loading: Info,
} as const;

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismissToast = useCallback((id: string) => {
    startTransition(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    });
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastRecord, "id">) => {
      const id = crypto.randomUUID();

      startTransition(() => {
        setToasts((current) => [...current, { ...toast, id }]);
      });

      const timeout = toast.variant === "loading" ? 4000 : 3200;
      window.setTimeout(() => dismissToast(id), timeout);

      return id;
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex justify-center px-4 sm:justify-end">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <AnimatePresence>
            {toasts.map((toast) => {
              const Icon = iconMap[toast.variant];

              return (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  className="pointer-events-auto rounded-3xl border border-border bg-white px-4 py-3 shadow-soft"
                  role="status"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-surface p-2">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{toast.title}</p>
                      {toast.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => dismissToast(toast.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      aria-label="Dismiss notification"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
