import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader as Spinner } from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
  const { initialized, loading, user } = useAuth();
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  return <Outlet />;
}
