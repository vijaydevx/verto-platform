import {
  createContext,
  startTransition,
  useEffect,
  useMemo,
  useState,
  useRef,
  type PropsWithChildren,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { LoginInput, RegisterInput } from "@/lib/validators";
import type { ProfileRow } from "@/types";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  initialized: boolean;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: (userId?: string) => Promise<ProfileRow | null>;
  updateProfileState: (profile: ProfileRow | null) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Use a ref to store the sync function to avoid closure issues in the useEffect
  // without needing the experimental useEffectEvent
  const syncAuthState = async (nextSession: Session | null) => {
    console.log("[AuthProvider] Syncing auth state:", nextSession?.user?.email ?? "no user");
    
    startTransition(() => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    if (!nextSession?.user) {
      startTransition(() => {
        setProfile(null);
      });
      return;
    }

    try {
      const nextProfile = await fetchProfile(nextSession.user.id);
      startTransition(() => {
        setProfile(nextProfile);
      });
    } catch (err) {
      console.error("[AuthProvider] Profile fetch error:", err);
      startTransition(() => {
        setProfile(null);
      });
    }
  };

  const syncRef = useRef(syncAuthState);
  syncRef.current = syncAuthState;

  useEffect(() => {
    let isMounted = true;
    console.log("[AuthProvider] Initializing...");

    const initialize = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        console.log("[AuthProvider] Current session:", currentSession?.user?.email ?? "none");
        await syncRef.current(currentSession);
      } catch (err) {
        console.error("[AuthProvider] Initialization error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
          console.log("[AuthProvider] Initialized.");
        }
      }
    };

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      console.log("[AuthProvider] Auth state changed event:", _event);
      void syncRef.current(nextSession).finally(() => {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      loading,
      initialized,
      signIn: async ({ email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          throw error;
        }
      },
      signUp: async ({ fullName, email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: fullName,
              campus_email: normalizedEmail,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (!data.user) {
          throw new Error("Unable to create your account.");
        }
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        startTransition(() => {
          setSession(null);
          setUser(null);
          setProfile(null);
        });
      },
      refreshProfile: async (userId?: string) => {
        const targetUserId = userId ?? user?.id;

        if (!targetUserId) {
          startTransition(() => {
            setProfile(null);
          });
          return null;
        }

        const nextProfile = await fetchProfile(targetUserId);

        startTransition(() => {
          setProfile(nextProfile);
        });

        return nextProfile;
      },
      updateProfileState: (nextProfile) => {
        startTransition(() => {
          setProfile(nextProfile);
        });
      },
    }),
    [initialized, loading, profile, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

