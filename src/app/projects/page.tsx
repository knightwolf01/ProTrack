"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AuthGuard from "@/components/AuthGuard";
import AnimatedCard from "@/components/AnimatedCard";
import FadeIn from "@/components/FadeIn";
import { useAuth } from "@/context/AuthContext";
import CreateProjectModal from "@/features/projects/CreateProjectModal";
import { projectsAPI } from "@/features/projects/api";
import { Project } from "@/features/projects/types";

const getMyRole = (project: Project, userId?: string) =>
  project.members.find((member) => member.user._id === userId)?.role;

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    void fetchProjects();
  }, []);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      ),
    [projects]
  );

  const fetchProjects = async () => {
    try {
      const result = await projectsAPI.getAll();
      setProjects(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      toast.error("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Delete this project and all of its tasks?")) {
      return;
    }

    try {
      const result = await projectsAPI.delete(projectId);
      if (result.success) {
        toast.success("Project deleted.");
        await fetchProjects();
      } else {
        toast.error(result.error || result.message || "Unable to delete project.");
      }
    } catch (error) {
      toast.error("Unable to delete project.");
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="zen-page flex min-h-[65vh] items-center justify-center">
          <div className="zen-panel w-full max-w-md p-10 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-primary-soft)] border-t-[var(--color-primary-strong)]"></div>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              Loading your projects...
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="zen-page">
        <FadeIn>
          <section className="zen-panel flex flex-col gap-6 p-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
            <div>
              <p className="zen-kicker">Projects</p>
              <h1 className="mt-3 text-5xl text-[var(--color-text)] sm:text-6xl">
                Team spaces with clear ownership.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
                Create a project, invite members by role, and keep every task in a
                shared place where ownership stays visible.
              </p>
            </div>

            <button onClick={() => setShowModal(true)} className="zen-button">
              New project
            </button>
          </section>

          {showModal ? (
            <CreateProjectModal
              onClose={() => setShowModal(false)}
              onSuccess={fetchProjects}
            />
          ) : null}

          <section className="mt-8">
            {sortedProjects.length === 0 ? (
              <div className="zen-panel p-10 text-center">
                <p className="text-3xl text-[var(--color-text)]">No projects yet</p>
                <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                  Start with one project and build the task flow from there.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="zen-button mt-6"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {sortedProjects.map((project, index) => {
                  const myRole = getMyRole(project, user?._id);
                  const isAdmin = myRole === "admin";

                  return (
                    <AnimatedCard key={project._id} delay={index * 0.06} className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-2xl text-[var(--color-text)]">{project.name}</p>
                          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                            {project.description || "No description added yet."}
                          </p>
                        </div>
                        <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-strong)]">
                          {myRole || "member"}
                        </span>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">
                        <span>{project.members.length} team member{project.members.length === 1 ? "" : "s"}</span>
                        <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link href={`/project/${project._id}`} className="zen-button">
                          Open project
                        </Link>
                        {isAdmin ? (
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="zen-button-danger"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </AnimatedCard>
                  );
                })}
              </div>
            )}
          </section>
        </FadeIn>
      </div>
    </AuthGuard>
  );
}
