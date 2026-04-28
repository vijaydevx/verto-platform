import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Apple, Chrome, Facebook } from "lucide-react";
import { AuthCard } from "@/components/layout/AuthLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { useToast } from "@/components/ui/Toast";

type RegisterFormState = RegisterInput;

const defaultValues: RegisterFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function mapRegisterErrors(result: z.SafeParseError<RegisterFormState>) {
  const fieldErrors = result.error.flatten().fieldErrors;

  return {
    fullName: fieldErrors.fullName?.[0] ?? "",
    email: fieldErrors.email?.[0] ?? "",
    password: fieldErrors.password?.[0] ?? "",
    confirmPassword: fieldErrors.confirmPassword?.[0] ?? "",
  };
}

function getFieldError<T extends keyof RegisterFormState>(
  schema: typeof registerSchema,
  values: RegisterFormState,
  field: T,
) {
  const partial = schema.safeParse(values);

  if (partial.success) {
    return "";
  }

  return partial.error.flatten().fieldErrors[field]?.[0] ?? "";
}

function getPasswordStrength(password: string) {
  const checks = [/[A-Z]/, /[a-z]/, /[0-9]/, /.{8,}/];
  return checks.filter((rule) => rule.test(password)).length;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { showToast } = useToast();
  const [values, setValues] = useState<RegisterFormState>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const [isRegistered, setIsRegistered] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(values.password), [values.password]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isRegistered) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-primary/10 text-primary">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Verify your email</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            We've sent a verification link to <span className="font-semibold text-foreground">{values.email}</span>. 
            Please check your inbox to activate your account.
          </p>
          <div className="mt-10">
            <Link to="/auth/login" className="font-semibold text-primary hover:text-primary/80 transition">
              Return to sign in
            </Link>
          </div>
        </section>
      </PageTransition>
    );
  }

  const onBlurField = (field: keyof RegisterFormState) => {
    setErrors((current) => ({
      ...current,
      [field]: getFieldError(registerSchema, values, field),
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(mapRegisterErrors(parsed));
      showToast({
        variant: "error",
        title: "Please fix the highlighted fields",
      });
      return;
    }

    setSubmitting(true);

    try {
      await signUp(parsed.data);
      setIsRegistered(true);
      showToast({
        variant: "success",
        title: "Registration successful",
        description: "Check your email for the verification link.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create your account.";
      showToast({
        variant: "error",
        title: "Registration failed",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <AuthCard
          title="Create account"
          description="Join Verto to report, match, and return items with a clean and secure workflow."
          panelCaption="Smart, calm, and reliable recovery tools for every campus member."
          footer={
            <p className="text-xl text-black/70">
              Already a member?{" "}
              <Link to="/auth/login" className="font-semibold text-[#6ca667] transition hover:text-[#4a8a43]">
                Login now
              </Link>
            </p>
          }
        >
          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="space-y-3">
              <label htmlFor="fullName" className="sr-only">
                Full name
              </label>
              <Input
                id="fullName"
                placeholder="Full name"
                value={values.fullName}
                error={errors.fullName}
                onChange={(event) => setValues((current) => ({ ...current, fullName: event.target.value }))}
                onBlur={() => onBlurField("fullName")}
                aria-invalid={Boolean(errors.fullName)}
                className="h-14 rounded-full border-black/25 bg-white/95 px-7 text-lg placeholder:text-black/35 focus:border-black/45 focus:ring-black/10"
              />
              {errors.fullName ? <p className="text-sm text-danger">{errors.fullName}</p> : null}
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="sr-only">
                Campus email
              </label>
              <Input
                id="email"
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
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <PasswordInput
                id="password"
                placeholder="Password"
                value={values.password}
                error={errors.password}
                onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
                onBlur={() => onBlurField("password")}
                aria-invalid={Boolean(errors.password)}
                className="h-14 rounded-full border-black/25 bg-white/95 px-7 text-lg placeholder:text-black/35 focus:border-black/45 focus:ring-black/10"
              />
              {errors.password ? <p className="text-sm text-danger">{errors.password}</p> : null}
              <div className="mt-3 flex gap-2" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${
                      index < passwordStrength ? "bg-[#6ca667]" : "bg-black/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm password
              </label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm password"
                value={values.confirmPassword}
                error={errors.confirmPassword}
                onChange={(event) =>
                  setValues((current) => ({ ...current, confirmPassword: event.target.value }))
                }
                onBlur={() => onBlurField("confirmPassword")}
                aria-invalid={Boolean(errors.confirmPassword)}
                className="h-14 rounded-full border-black/25 bg-white/95 px-7 text-lg placeholder:text-black/35 focus:border-black/45 focus:ring-black/10"
              />
              {errors.confirmPassword ? <p className="text-sm text-danger">{errors.confirmPassword}</p> : null}
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-1 h-14 w-full rounded-full !bg-black text-xl font-semibold !text-white shadow-none hover:!bg-black/90 focus-visible:!ring-black/25"
              loading={submitting}
            >
              Sign up
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
