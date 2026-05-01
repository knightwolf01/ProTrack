"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { projectsAPI } from "./api";
import { CreateProjectRequest } from "./types";

interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateProjectModal({
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const result = await projectsAPI.create(formData);
      if (result.success) {
        toast.success("Project created.");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || result.message || "Failed to create project.");
      }
    } catch (error) {
      toast.error("An unexpected error interrupted project creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(35,49,40,0.18)] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        className="zen-panel w-full max-w-xl p-7 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="zen-kicker">New project</p>
        <h2 className="mt-2 text-3xl text-[var(--color-text)]">
          Start a new workspace
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Keep the scope clear now so tasks and assignments stay easier later.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="zen-label">Project name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="zen-input"
              placeholder="Website redesign"
            />
          </div>

          <div>
            <label className="zen-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="zen-input"
              placeholder="Summarize the goal, timeline, and context for this project."
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" onClick={onClose} className="zen-button-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="zen-button">
              {loading ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
