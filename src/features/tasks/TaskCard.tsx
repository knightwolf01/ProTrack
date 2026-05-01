"use client";

import { motion } from "framer-motion";
import { Task, TaskStatus } from "./types";

interface TaskCardProps {
  task: Task;
  canDelete: boolean;
  canUpdateStatus: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "To do" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const accentByStatus: Record<TaskStatus, string> = {
  todo: "border-[var(--color-primary)]",
  "in-progress": "border-[var(--color-warning)]",
  done: "border-[var(--color-primary-strong)]",
};

export default function TaskCard({
  task,
  canDelete,
  canUpdateStatus,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && task.status !== "done" && dueDate.getTime() < Date.now();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={`zen-panel border-l-4 p-5 ${accentByStatus[task.status]}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="text-2xl text-[var(--color-text)]">{task.title}</h4>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {task.description || "No description provided."}
              </p>
            </div>

            {canDelete ? (
              <button
                onClick={() => onDelete(task._id)}
                className="zen-button-danger"
              >
                Remove
              </button>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
            <div className="zen-panel-soft flex-1 min-w-[130px] px-4 py-3">
              <p className="text-xs uppercase tracking-wider">Assignee</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text)] truncate">
                {task.assignedTo?.name || "Unassigned"}
              </p>
            </div>
            <div className="zen-panel-soft flex-1 min-w-[130px] px-4 py-3">
              <p className="text-xs uppercase tracking-wider">Due date</p>
              <p
                className={`mt-1 text-sm font-semibold truncate ${
                  isOverdue ? "text-[var(--color-danger)]" : "text-[var(--color-text)]"
                }`}
              >
                {dueDate ? dueDate.toLocaleDateString() : "Not set"}
              </p>
            </div>
            <div className="zen-panel-soft flex-1 min-w-[130px] px-4 py-3">
              <p className="text-xs uppercase tracking-wider truncate">Created by</p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-text)] truncate">
                {task.createdBy?.name || "Unknown"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[220px]">
          <label className="zen-label">Status</label>
          <select
            value={task.status}
            onChange={(event) =>
              onStatusChange(task._id, event.target.value as TaskStatus)
            }
            disabled={!canUpdateStatus}
            className="zen-input"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
            {canUpdateStatus
              ? "Status updates are enabled for you."
              : "Only project admins or the assigned member can update this status."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
