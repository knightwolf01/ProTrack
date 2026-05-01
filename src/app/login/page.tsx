"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Welcome back.");
        router.push("/dashboard");
      } else {
        toast.error("We couldn't sign you in with those details.");
      }
    } catch (error) {
      toast.error("An unexpected error interrupted sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zen-page flex min-h-[78vh] items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <section className="zen-panel flex flex-col justify-between p-8 sm:p-10">
          <div>
            <p className="zen-kicker">Calm coordination</p>
            <h1 className="mt-4 max-w-lg text-5xl text-[var(--color-text)] sm:text-6xl">
              Keep projects moving without the noise.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-muted)]">
              Zen Focus brings projects, teammates, and task ownership into one
              thoughtful space so priorities stay clear.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Projects", "Create workspaces and invite teammates by role."],
              ["Assignments", "Assign tasks, due dates, and clear status updates."],
              ["Dashboard", "See progress, overdue work, and your next priorities."],
            ].map(([title, description]) => (
              <div key={title} className="zen-panel-soft p-5">
                <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="zen-panel p-8 sm:p-10">
          <p className="zen-kicker">Welcome back</p>
          <h2 className="mt-3 text-4xl text-[var(--color-text)]">Sign in</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Pick up where you left off and move the next task forward.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="zen-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="zen-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="zen-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="zen-input"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" disabled={loading} className="zen-button w-full">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--color-muted)]">
            New here?{" "}
            <Link href="/signup" className="zen-link">
              Create an account
            </Link>
          </p>
        </section>
      </motion.div>
    </div>
  );
}
