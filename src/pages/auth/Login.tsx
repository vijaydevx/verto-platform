import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Apple, Chrome, Facebook } from "lucide-react";
import { AuthCard } from "@/components/layout/AuthLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/lib/validators";

const defaultValues: LoginInput = {
  email: "",
  password: "",
};

function mapLoginErrors(result: ReturnType<typeof loginSchema.safeParse>) {
  if (result.success) {
    return {};
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  return {
    email: fieldErrors.email?.[0] ?? "",
    password: fieldErrors.password?.[0] ?? "",
  };
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, signIn } = useAuth();
  const { showToast } = useToast();
  const [values, setValues] = useState<LoginInput>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  if (user) {
    return <Navigate to={redirectTarget} replace state={{ from: location }} />;
  }

  const onBlurField = (field: keyof LoginInput) => {
    const parsed = loginSchema.safeParse(values);

    if (parsed.success) {
      setErrors((current) => ({ ...current, [field]: "" }));
      return;
    }

    setErrors((current) => ({
      ...current,
      [field]: parsed.error.flatten().fieldErrors[field]?.[0] ?? "",
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(mapLoginErrors(parsed));
      showToast({
        variant: "error",
        title: "Enter your campus email and password",
      });
      return;
    }

    setSubmitting(true);

    try {
      await signIn(parsed.data);
      showToast({
        variant: "success",
        title: "Welcome back",
        description: "Your session is active and ready to go.",
      });
      void navigate(redirectTarget, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign you in.";
      const normalized = message.toLowerCase();
      let title = "Login failed";
      let description = message;

      if (normalized.includes("invalid login credentials")) {
        title = "Invalid credentials";
        description = "Use your registered campus email and password.";
      } else if (normalized.includes("email not confirmed") || normalized.includes("not confirmed")) {
        title = "Verify your email first";
        description = "Check your inbox and click the verification link before signing in.";
      } else if (normalized.includes("too many requests")) {
        title = "Too many attempts";
        description = "Please wait a minute and try again.";
      }

      showToast({
        variant: "error",
        title,
        description,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <AuthCard
          title="Welcome back!"
          description="Simplify your workflow and boost your productivity with Verto's app. Get started for free."
          panelCaption="From report to return, everything stays simple, secure, and organized."
          footer={
            <p className="text-xl text-black/70">
              Not a member?{" "}
              <Link to="/auth/register" className="font-semibold text-[#6ca667] transition hover:text-[#4a8a43]">
                Register now
              </Link>
            </p>
          }
        >
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="space-y-3">
              <label htmlFor="login-email" className="sr-only">
                Campus email
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="Campus email"
                value={values.email}
                error={errors.email}
                onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
                onBlur={() => onBlurField("email")}
                aria-invalid={Boolean(errors.email)}
                className="h-14 rounded-full border-black/25 bg-white/95 px-7 text-lg placeholder:text-black/35 focus:border-black/45 focus:ring-black/10"
              />
              {errors.email ? <p className="text-sm text-danger">{errors.email}</p> : null}
            </div>

            <div className="space-y-3">
              <label htmlFor="login-password" className="sr-only">
                Password
              </label>
              <PasswordInput
                id="login-password"
                placeholder="Password"
                value={values.password}
                error={errors.password}
                onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
                onBlur={() => onBlurField("password")}
                aria-invalid={Boolean(errors.password)}
                className="h-14 rounded-full border-black/25 bg-white/95 px-7 text-lg placeholder:text-black/35 focus:border-black/45 focus:ring-black/10"
              />
              {errors.password ? <p className="text-sm text-danger">{errors.password}</p> : null}
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm font-semibold text-black/65 transition hover:text-black/90">
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-1 h-14 w-full rounded-full !bg-black text-xl font-semibold !text-white shadow-none hover:!bg-black/90 focus-visible:!ring-black/25"
              loading={submitting}
            >
              Login
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-black/20" />
            <span className="text-sm font-medium text-black/55">or continue with</span>
            <div className="h-px flex-1 bg-black/20" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-5">
            <button type="button" className="grid h-14 w-14 place-items-center rounded-full bg-black text-white transition hover:scale-105 hover:bg-black/90">
              <Chrome className="h-5 w-5" />
            </button>
            <button type="button" className="grid h-14 w-14 place-items-center rounded-full bg-black text-white transition hover:scale-105 hover:bg-black/90">
              <Apple className="h-5 w-5" />
            </button>
            <button type="button" className="grid h-14 w-14 place-items-center rounded-full bg-black text-white transition hover:scale-105 hover:bg-black/90">
              <Facebook className="h-5 w-5" />
            </button>
          </div>
        </AuthCard>
      </section>
    </PageTransition>
  );
}
