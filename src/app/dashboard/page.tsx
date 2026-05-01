"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AuthGuard from "@/components/AuthGuard";
import FadeIn from "@/components/FadeIn";
import StatCard from "@/components/StatCard";
import { tasksAPI } from "@/features/tasks/api";
import { DashboardStats, TaskStatus } from "@/features/tasks/types";

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

const statusClasses: Record<TaskStatus, string> = {
  todo: "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]",
  "in-progress": "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  done: "bg-[rgba(111,150,125,0.14)] text-[var(--color-primary-strong)]",
};

const emptyStats: DashboardStats = {
  totalProjects: 0,
  totalTasks: 0,
  completedTasks: 0,
  overdueTasks: 0,
  assignedToMe: 0,
  inProgressTasks: 0,
  todoTasks: 0,
  recentProjects: [],
  myTasks: [],
};

const iconClassName = "h-5 w-5";

const icons = {
  project: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
      <path strokeWidth="1.7" strokeLinecap="round" d="M4 7.5h16M7 4.5v6M17 4.5v6M5.5 19.5h13a1.5 1.5 0 0 0 1.5-1.5V8a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 4 8v10a1.5 1.5 0 0 0 1.5 1.5Z" />
    </svg>
  ),
  task: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
      <path strokeWidth="1.7" strokeLinecap="round" d="M8 7h10M8 12h10M8 17h6M4.5 7.5h.01M4.5 12.5h.01M4.5 17.5h.01" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
      <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="m5 12 4.2 4.2L19 6.5" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
      <circle cx="12" cy="12" r="8" strokeWidth="1.7" />
      <path strokeWidth="1.7" strokeLinecap="round" d="M12 8v4l2.5 1.5" />
    </svg>
  ),
  focus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
      <path strokeWidth="1.7" strokeLinecap="round" d="M4 12h4m8 0h4M12 4v4m0 8v4" />
      <circle cx="12" cy="12" r="3.5" strokeWidth="1.7" />
    </svg>
  ),
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const result = await tasksAPI.getDashboard();
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        toast.error(result.error || "Unable to load dashboard insights.");
      }
    } catch (error) {
      toast.error("Unable to load dashboard insights.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="zen-page flex min-h-[65vh] items-center justify-center">
          <div className="zen-panel w-full max-w-md p-10 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-primary-soft)] border-t-[var(--color-primary-strong)]"></div>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              Gathering your task overview...
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
          <section className="zen-panel grid gap-6 p-8 sm:p-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="zen-kicker">Dashboard</p>
              <h1 className="mt-3 text-5xl text-[var(--color-text)] sm:text-6xl">
                See what needs attention without searching for it.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
                Track project health, overdue work, and the tasks currently
                assigned to you from one calm overview.
              </p>
            </div>

            <div className="zen-panel-soft flex flex-col justify-between gap-4 p-6">
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Today&apos;s focus
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  You have {stats.assignedToMe} task{stats.assignedToMe === 1 ? "" : "s"} assigned to you
                  and {stats.overdueTasks} overdue item{stats.overdueTasks === 1 ? "" : "s"} across your workspace.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/projects" className="zen-button">
                  Open projects
                </Link>
                <Link href="/projects" className="zen-button-secondary">
                  Create something new
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            <StatCard icon={icons.project} label="Projects" value={stats.totalProjects} color="blue" />
            <StatCard icon={icons.task} label="Total tasks" value={stats.totalTasks} color="blue" />
            <StatCard icon={icons.check} label="Completed" value={stats.completedTasks} color="green" />
            <StatCard icon={icons.clock} label="Overdue" value={stats.overdueTasks} color="red" />
            <StatCard icon={icons.focus} label="Assigned to me" value={stats.assignedToMe} color="yellow" />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="zen-panel p-7 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="zen-kicker">Recent projects</p>
                  <h2 className="mt-2 text-3xl text-[var(--color-text)]">
                    Where your team is working
                  </h2>
                </div>
                <Link href="/projects" className="zen-link text-sm">
                  View all projects
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {stats.recentProjects.length === 0 ? (
                  <div className="zen-panel-soft p-6 text-sm leading-6 text-[var(--color-muted)]">
                    No projects yet. Create your first project to start assigning work.
                  </div>
                ) : (
                  stats.recentProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/project/${project._id}`}
                      className="zen-panel-soft block p-5 transition hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xl font-semibold text-[var(--color-text)]">
                            {project.name}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                            {project.description || "No description added yet."}
                          </p>
                        </div>
                        <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-strong)]">
                          {project.members.length} member{project.members.length === 1 ? "" : "s"}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="zen-panel p-7 sm:p-8">
              <div>
                <p className="zen-kicker">Assigned to you</p>
                <h2 className="mt-2 text-3xl text-[var(--color-text)]">
                  Your next tasks
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {stats.myTasks.length === 0 ? (
                  <div className="zen-panel-soft p-6 text-sm leading-6 text-[var(--color-muted)]">
                    Nothing is assigned to you right now. That&apos;s a good time to plan the next project.
                  </div>
                ) : (
                  stats.myTasks.map((task) => {
                    const taskProject =
                      typeof task.projectId === "string" ? null : task.projectId;

                    return (
                      <div key={task._id} className="zen-panel-soft p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-semibold text-[var(--color-text)]">
                              {task.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                              {task.description || "No description provided."}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[task.status]}`}
                          >
                            {statusLabels[task.status]}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">
                          {taskProject ? <span>{taskProject.name}</span> : null}
                          {task.dueDate ? (
                            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                          ) : (
                            <span>No due date</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </FadeIn>
      </div>
    </AuthGuard>
  );
}
