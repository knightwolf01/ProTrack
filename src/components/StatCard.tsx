"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  color?: "blue" | "green" | "red" | "yellow";
}

const colorClasses = {
  blue: "bg-[rgba(127,159,138,0.14)] text-[var(--color-primary-strong)] border-[rgba(127,159,138,0.24)]",
  green: "bg-[rgba(111,150,125,0.14)] text-[var(--color-primary-strong)] border-[rgba(111,150,125,0.24)]",
  red: "bg-[rgba(168,111,103,0.12)] text-[var(--color-danger)] border-[rgba(168,111,103,0.2)]",
  yellow: "bg-[rgba(182,144,83,0.14)] text-[var(--color-warning)] border-[rgba(182,144,83,0.24)]",
};

export default function StatCard({
  icon,
  label,
  value,
  color = "blue",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`zen-panel p-6 ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--color-text)]">{value}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-current/10 text-xl">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
