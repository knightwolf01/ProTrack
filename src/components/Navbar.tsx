"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-[30px] border border-[var(--color-border)] bg-[rgba(255,252,246,0.82)] px-5 py-4 shadow-[0_18px_40px_rgba(58,69,56,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]">
              Z
            </div>
            <div>
              <p className="font-semibold tracking-[0.14em] text-[var(--color-primary-strong)] uppercase text-xs">
                Zen Focus
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                Calm project management
              </p>
            </div>
          </Link>
        </div>

        {isAuthenticated ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.6)] p-1">
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-text)]"
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-text)]"
              >
                Projects
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] px-4 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-[var(--color-muted)]">
                  {user?.email}
                </p>
              </div>
              <button onClick={handleLogout} className="zen-button-secondary !px-4 !py-2">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="zen-button-secondary !px-4 !py-2">
              Login
            </Link>
            <Link href="/signup" className="zen-button !px-4 !py-2">
              Create account
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
