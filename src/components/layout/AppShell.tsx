import { useEffect, useState, type PropsWithChildren } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, Package, PackagePlus, Settings, UserCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface NavLinkItem {
  to: string;
  label: string;
  badge?: string | number;
}

const navLinks: NavLinkItem[] = [
  { to: "/dashboard", label: "Browse" },
  { to: "/post", label: "Post Item" },
  { to: "/my-items", label: "My Items" },
];

export function AppShell({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isLandingPage = location.pathname === "/";
  const profileName = profile?.full_name ?? "Member";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=2E7D5B&color=ffffff&size=80`;

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    try {
      await signOut();
      void navigate("/");
    } catch {
      // no-op
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {!isLandingPage ? (
        <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F8F9FA]/88 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
              <img src="/verto-logo.png" alt="Verto" className="h-10 w-auto" />
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/80">
                Campus Sanctuary
              </p>
            </Link>

            {user ? (
              <nav className="ml-3 hidden flex-1 items-center justify-center gap-2 lg:flex">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition",
                        isActive
                          ? "bg-[#2E7D5B] text-white shadow-lg shadow-[#2E7D5B]/25"
                          : "text-slate-600 hover:bg-white hover:text-slate-900",
                      )
                    }
                  >
                    <span>{link.label}</span>
                    {link.badge ? (
                      <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-1 text-[11px] font-black">
                        {link.badge}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
              </nav>
            ) : (
              <div className="flex-1" />
            )}

            <div className="ml-auto flex items-center gap-2">
              {user ? (
                <>


                  <Button
                    variant="primary"
                    onClick={() => void navigate("/post")}
                    className="hidden h-11 rounded-full bg-[#2E7D5B] px-5 font-bold text-white shadow-lg shadow-[#2E7D5B]/25 hover:bg-[#245f45] sm:inline-flex"
                  >
                    <PackagePlus className="h-4 w-4" />
                    <span>New Post</span>
                  </Button>

                  <div className="relative hidden sm:block">
                    <button
                      type="button"
                      onClick={() => setProfileMenuOpen((current) => !current)}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1 pr-3"
                    >
                      <img src={avatarUrl} alt={profileName} className="h-8 w-8 rounded-full object-cover" />
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </button>

                    {profileMenuOpen ? (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl border border-black/10 bg-white p-1 shadow-xl">
                        <button
                          type="button"
                          onClick={() => void navigate("/my-items")}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Package className="h-4 w-4" />
                          My Items
                        </button>
                        <button
                          type="button"
                          onClick={() => void navigate("/settings")}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Settings className="h-4 w-4" />
                          Profile Settings
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleLogout()}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((current) => !current)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-slate-600 sm:hidden"
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/auth/login">
                    <Button variant="ghost" className="rounded-full font-bold">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button className="rounded-full bg-[#2E7D5B] font-bold text-white hover:bg-[#245f45]">Join Now</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {user && mobileMenuOpen ? (
            <div className="border-t border-black/5 bg-white/95 px-4 py-4 sm:hidden">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <span>{link.label}</span>
                    {link.badge ? (
                      <span className="rounded-full bg-[#2E7D5B]/15 px-2 py-0.5 text-xs font-black text-[#2E7D5B]">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => void navigate("/post")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D5B] px-4 py-3 text-sm font-bold text-white"
                >
                  <PackagePlus className="h-4 w-4" />
                  New Post
                </button>
                <button
                  type="button"
                  onClick={() => void navigate("/my-items")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <Package className="h-4 w-4" />
                  My Items
                </button>
                <button
                  type="button"
                  onClick={() => void navigate("/settings")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <UserCircle2 className="h-4 w-4" />
                  Profile Settings
                </button>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </header>
      ) : null}

      <main>{children}</main>
    </div>
  );
}
