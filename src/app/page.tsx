"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="zen-page flex min-h-[70vh] items-center justify-center">
      <FadeIn>
        <div className="zen-panel max-w-md px-10 py-12 text-center">
          <p className="zen-kicker">Zen Focus</p>
          <h1 className="mt-3 text-4xl text-[var(--color-text)]">
            Settling your workspace
          </h1>
          <div className="mx-auto mt-8 h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-primary-soft)] border-t-[var(--color-primary-strong)]"></div>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Redirecting you to the right place...
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
