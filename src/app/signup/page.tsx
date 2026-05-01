"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords need to match.");
      return;
    }

    setLoading(true);

    try {
      const success = await signup(formData.name, formData.email, formData.password);
      if (success) {
        toast.success("Your workspace is ready.");
        router.push("/dashboard");
      } else {
        toast.error("We couldn't create your account.");
      }
    } catch (error) {
      toast.error("An unexpected error interrupted sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zen-page flex min-h-[78vh] items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <section className="zen-panel p-8 sm:p-10">
          <p className="zen-kicker">Start simply</p>
          <h1 className="mt-3 text-5xl text-[var(--color-text)] sm:text-6xl">
            Create your calm command center.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[var(--color-muted)]">
            Set up projects, invite collaborators, assign clear ownership, and
            keep status updates visible without turning the workspace into noise.
          </p>

          <div className="mt-10 space-y-3">
            {[
              "Invite teammates to a project as admins or members.",
              "Assign tasks with clear due dates and live status tracking.",
              "Spot overdue work and tasks assigned to you from the dashboard.",
            ].map((item) => (
              <div
                key={item}
                className="zen-panel-soft flex items-start gap-3 px-4 py-4"
              >
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]"></div>
                <p className="text-sm leading-6 text-[var(--color-muted)]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="zen-panel p-8 sm:p-10">
          <p className="zen-kicker">Create account</p>
          <h2 className="mt-3 text-4xl text-[var(--color-text)]">Join Zen Focus</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            A small setup now gives you a clearer project flow later.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="zen-label">Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="zen-input"
                placeholder="Aarav Sharma"
              />
            </div>

            <div>
              <label className="zen-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="zen-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="zen-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="zen-input"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="zen-label">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="zen-input"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="zen-button w-full">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--color-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="zen-link">
              Sign in
            </Link>
          </p>
        </section>
      </motion.div>
    </div>
  );
}
