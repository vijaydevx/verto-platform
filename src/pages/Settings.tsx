import { useEffect, useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/useItems";
import { supabase } from "@/lib/supabase";
import { passwordChangeSchema, profileSchema } from "@/lib/validators";

const emptyPasswordState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function mapPasswordErrors(result: ReturnType<typeof passwordChangeSchema.safeParse>) {
  if (result.success) {
    return {};
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  return {
    currentPassword: fieldErrors.currentPassword?.[0] ?? "",
    newPassword: fieldErrors.newPassword?.[0] ?? "",
    confirmPassword: fieldErrors.confirmPassword?.[0] ?? "",
  };
}

export function SettingsPage() {
  const { user, profile, refreshProfile, updateProfileState } = useAuth();
  const { showToast } = useToast();
  const [profileName, setProfileName] = useState(profile?.full_name ?? "");
  const [profileError, setProfileError] = useState("");
  const [passwordValues, setPasswordValues] = useState(emptyPasswordState);
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof typeof emptyPasswordState, string>>>({});
  
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    setProfileName(profile?.full_name ?? "");
  }, [profile?.full_name]);

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = profileSchema.safeParse({ fullName: profileName });

    if (!parsed.success) {
      setProfileError(parsed.error.flatten().fieldErrors.fullName?.[0] ?? "Enter your full name.");
      return;
    }

    if (!user) {
      return;
    }

    try {
      const updated = await updateProfileMutation.mutateAsync({
        userId: user.id,
        fullName: parsed.data.fullName,
      });

      updateProfileState(updated);
      await refreshProfile(user.id);
      setProfileError("");

      showToast({
        variant: "success",
        title: "Profile updated",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update your profile.";
      showToast({
        variant: "error",
        title: "Profile update failed",
        description: message,
      });
    }
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = passwordChangeSchema.safeParse(passwordValues);

    if (!parsed.success) {
      setPasswordErrors(mapPasswordErrors(parsed));
      return;
    }

    if (!user?.email) {
      return;
    }

    try {
      const verify = await supabase.auth.signInWithPassword({
        email: user.email,
        password: parsed.data.currentPassword,
      });

      if (verify.error) {
        throw verify.error;
      }

      const update = await supabase.auth.updateUser({
        password: parsed.data.newPassword,
      });

      if (update.error) {
        throw update.error;
      }

      setPasswordValues(emptyPasswordState);
      setPasswordErrors({});
      showToast({
        variant: "success",
        title: "Password updated",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to change your password.";
      showToast({
        variant: "error",
        title: "Password update failed",
        description: message,
      });
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Settings</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground">
            Profile & Security
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-foreground">Profile settings</h2>
            <form className="mt-5 space-y-4" onSubmit={saveProfile} noValidate>
              <FormField id="profile-name" label="Full name" required error={profileError}>
                <Input
                  id="profile-name"
                  value={profileName}
                  error={profileError}
                  onChange={(event) => setProfileName(event.target.value)}
                  onBlur={() => {
                    const result = profileSchema.safeParse({ fullName: profileName });
                    setProfileError(result.success ? "" : result.error.flatten().fieldErrors.fullName?.[0] ?? "");
                  }}
                />
              </FormField>
              <Button type="submit" loading={updateProfileMutation.isPending}>
                Save profile
              </Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-foreground">Change password</h2>
            <form className="mt-5 space-y-4" onSubmit={changePassword} noValidate>
              <FormField id="current-password" label="Current password" required error={passwordErrors.currentPassword}>
                <PasswordInput
                  id="current-password"
                  value={passwordValues.currentPassword}
                  error={passwordErrors.currentPassword}
                  onChange={(event) =>
                    setPasswordValues((current) => ({ ...current, currentPassword: event.target.value }))
                  }
                />
              </FormField>

              <FormField id="new-password" label="New password" required error={passwordErrors.newPassword}>
                <PasswordInput
                  id="new-password"
                  value={passwordValues.newPassword}
                  error={passwordErrors.newPassword}
                  onChange={(event) =>
                    setPasswordValues((current) => ({ ...current, newPassword: event.target.value }))
                  }
                />
              </FormField>

              <FormField id="confirm-password" label="Confirm new password" required error={passwordErrors.confirmPassword}>
                <PasswordInput
                  id="confirm-password"
                  value={passwordValues.confirmPassword}
                  error={passwordErrors.confirmPassword}
                  onChange={(event) =>
                    setPasswordValues((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  onBlur={() => {
                    const result = passwordChangeSchema.safeParse(passwordValues);
                    setPasswordErrors(mapPasswordErrors(result));
                  }}
                />
              </FormField>

              <Button type="submit">Update password</Button>
            </form>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}
