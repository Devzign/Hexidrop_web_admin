import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { DEMO_ACCOUNTS, usePermissions } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import brandMark from "@/assets/hexidrop-mark.png.asset.json";



export function LoginPage() {
  const { signIn, session, ready } = usePermissions();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@hexidrop.co.zw");
  const [password, setPassword] = useState("hexidrop");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && session) navigate("/admin", { replace: true });
  }, [ready, session, navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = signIn(email, password);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Sign in failed.");
      return;
    }
    setError(null);
    toast.success("Welcome back to HexiDrop");
    navigate("/admin", { replace: true });
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background/95">
            <img src={"/favicon.png"} alt="HexiDrop" className="h-8 w-8 object-contain" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            HEXI<span className="text-brand-gold">DROP</span>
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            The operations console behind every HexiDrop delivery.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
            Live tracking across 12 Zimbabwean cities, 1,284 verified drivers, movers &amp; packers
            scheduling, payouts and reporting — all in one role-scoped workspace.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { k: "12", v: "Cities" },
              { k: "1,284", v: "Drivers" },
              { k: "99.2%", v: "On-time" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl bg-background/10 px-4 py-3 backdrop-blur">
                <p className="text-xl font-semibold">{s.k}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-primary-foreground/70">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} HexiDrop Logistics · Harare, Zimbabwe
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border bg-card">
              <img src={"/favicon.png"} alt="HexiDrop" className="h-7 w-7 object-contain" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              <span className="text-primary">HEXI</span>
              <span className="text-brand-gold">DROP</span>
            </span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Use your HexiDrop work account to access the ops console.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                className="mt-1.5 h-11 w-full rounded-xl border bg-card px-3.5 text-sm outline-none transition-shadow focus:ring-3 focus:ring-primary/25"
                placeholder="you@hexidrop.co.zw"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className="h-11 w-full rounded-xl border bg-card px-3.5 pr-11 text-sm outline-none transition-shadow focus:ring-3 focus:ring-primary/25"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {busy ? "Signing in…" : "Sign in to console"}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border bg-card p-4">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" /> Demo accounts
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Password for every account: <span className="font-mono">hexidrop</span>
            </p>
            <ul className="mt-3 space-y-1">
              {DEMO_ACCOUNTS.map((a) => (
                <li key={a.email}>
                  <button
                    type="button"
                    onClick={() => { setEmail(a.email); setPassword(a.password); setError(null); }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-accent",
                      email === a.email && "bg-primary/10 text-primary",
                    )}
                  >
                    <span className="font-mono">{a.email}</span>
                    <span className="ml-3 shrink-0 font-medium">{a.role}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
