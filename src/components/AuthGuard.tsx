"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=" + pathname);
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    return (
      <div className="zen-page flex min-h-[60vh] items-center justify-center">
        <div className="zen-panel w-full max-w-md p-10 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-primary-soft)] border-t-[var(--color-primary-strong)]"></div>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Restoring your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
