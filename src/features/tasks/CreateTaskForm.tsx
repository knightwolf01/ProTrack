"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ProjectMember } from "@/features/projects/types";
import { tasksAPI } from "./api";
import { CreateTaskRequest, TaskStatus } from "./types";

interface CreateTaskFormProps {
  projectId: string;
  members: ProjectMember[];
  onSuccess: () => void;
  onCancel: () => void;
}

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "To do" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export default function CreateTaskForm({
  projectId,
  members,
  onSuccess,
  onCancel,
}: CreateTaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await tasksAPI.create(projectId, {
        ...formData,
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate || undefined,
      });

      if (result.success) {
        toast.success("Task created.");
        onSuccess();
      } else {
        toast.error(result.error || result.message || "Unable to create task.");
      }
    } catch (error) {
      toast.error("Unable to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="zen-panel space-y-5 p-6 sm:p-7"
    >
      <div>
        <p className="zen-kicker">Task setup</p>
        <h3 className="mt-2 text-3xl text-[var(--color-text)]">Create a task</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Give the team one clear task with ownership, due date, and status.
        </p>
      </div>

      <div>
        <label className="zen-label">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="zen-input"
          placeholder="Draft dashboard copy"
        />
      </div>

      <div>
        <label className="zen-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="zen-input"
          placeholder="Add the context your teammate needs to complete this well."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="zen-label">Assign to</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="zen-input"
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.user._id} value={member.user._id}>
                {member.user.name} ({member.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="zen-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="zen-input"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="zen-label">Due date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="zen-input"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" onClick={onCancel} className="zen-button-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="zen-button">
          {loading ? "Creating..." : "Create task"}
        </button>
      </div>
    </motion.form>
  );
}
