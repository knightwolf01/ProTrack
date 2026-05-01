"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import AuthGuard from "@/components/AuthGuard";
import FadeIn from "@/components/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { projectsAPI } from "@/features/projects/api";
import {
  AddProjectMemberRequest,
  Project,
  ProjectMemberRole,
} from "@/features/projects/types";
import CreateTaskForm from "@/features/tasks/CreateTaskForm";
import TaskCard from "@/features/tasks/TaskCard";
import { tasksAPI } from "@/features/tasks/api";
import { Task, TaskStatus } from "@/features/tasks/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [inviteForm, setInviteForm] = useState<AddProjectMemberRequest>({
    email: "",
    role: "member",
  });
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (projectId) {
      void fetchProjectAndTasks();
    }
  }, [projectId]);

  const currentRole = useMemo(
    () => project?.members.find((member) => member.user._id === user?._id)?.role,
    [project, user?._id]
  );
  const isAdmin = currentRole === "admin";

  const stats = useMemo(() => {
    const overdue = tasks.filter((task) => {
      if (!task.dueDate || task.status === "done") {
        return false;
      }

      return new Date(task.dueDate).getTime() < Date.now();
    }).length;

    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "done").length,
      inProgress: tasks.filter((task) => task.status === "in-progress").length,
      overdue,
    };
  }, [tasks]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectResult, tasksResult] = await Promise.all([
        projectsAPI.getById(projectId),
        tasksAPI.getByProject(projectId),
      ]);

      const projectData = projectResult.data;
      setProject(Array.isArray(projectData) ? projectData[0] ?? null : projectData ?? null);
      setTasks(Array.isArray(tasksResult.data) ? tasksResult.data : []);
    } catch (error) {
      toast.error("Unable to load this project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Delete this task?")) {
      return;
    }

    try {
      const result = await tasksAPI.delete(taskId);
      if (result.success) {
        toast.success("Task deleted.");
        await fetchProjectAndTasks();
      } else {
        toast.error(result.error || result.message || "Unable to delete task.");
      }
    } catch (error) {
      toast.error("Unable to delete task.");
    }
  };

  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      const result = await tasksAPI.update(taskId, { status });
      if (result.success) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task._id === taskId && result.data && !Array.isArray(result.data)
              ? result.data
              : task
          )
        );
        toast.success("Task status updated.");
      } else {
        toast.error(result.error || result.message || "Unable to update task.");
      }
    } catch (error) {
      toast.error("Unable to update task.");
    }
  };

  const handleInviteChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "role") {
      setInviteForm((current) => ({
        ...current,
        role: value as ProjectMemberRole,
      }));
      return;
    }

    setInviteForm((current) => ({
      ...current,
      email: value,
    }));
  };

  const handleAddMember = async (event: React.FormEvent) => {
    event.preventDefault();
    setInviting(true);

    try {
      const result = await projectsAPI.addMember(projectId, inviteForm);
      if (result.success && result.data && !Array.isArray(result.data)) {
        setProject(result.data);
        setInviteForm({ email: "", role: "member" });
        toast.success("Member added to the project.");
      } else {
        toast.error(result.error || result.message || "Unable to add member.");
      }
    } catch (error) {
      toast.error("Unable to add member.");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove this member from the project?")) {
      return;
    }

    try {
      const result = await projectsAPI.removeMember(projectId, memberId);
      if (result.success && result.data && !Array.isArray(result.data)) {
        setProject(result.data);
        toast.success("Member removed.");
      } else {
        toast.error(result.error || result.message || "Unable to remove member.");
      }
    } catch (error) {
      toast.error("Unable to remove member.");
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="zen-page flex min-h-[65vh] items-center justify-center">
          <div className="zen-panel w-full max-w-md p-10 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-primary-soft)] border-t-[var(--color-primary-strong)]"></div>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              Loading project details...
            </p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!project) {
    return (
      <AuthGuard>
        <div className="zen-page">
          <div className="zen-panel p-10 text-center">
            <p className="text-3xl text-[var(--color-text)]">Project not found</p>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              It may have been removed or you may no longer have access.
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
          <section className="zen-panel grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="zen-kicker">Project workspace</p>
              <h1 className="mt-3 text-5xl text-[var(--color-text)] sm:text-6xl">
                {project.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
                {project.description || "No description has been added for this project yet."}
              </p>
            </div>

            <div className="zen-panel-soft grid gap-4 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Your role
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                  {currentRole === "admin" ? "Project admin" : "Project member"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Owner
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                  {project.createdBy.name}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Team size
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                  {project.members.length} member{project.members.length === 1 ? "" : "s"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Created
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Tasks", stats.total],
              ["Completed", stats.completed],
              ["In progress", stats.inProgress],
              ["Overdue", stats.overdue],
            ].map(([label, value]) => (
              <div key={label} className="zen-panel p-6">
                <p className="text-sm text-[var(--color-muted)]">{label}</p>
                <p className="mt-3 text-4xl font-semibold text-[var(--color-text)]">
                  {value}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="zen-panel p-7 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="zen-kicker">Tasks</p>
                    <h2 className="mt-2 text-3xl text-[var(--color-text)]">
                      Project work
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                      Admins can create and assign tasks. Members can update the
                      status of tasks assigned to them.
                    </p>
                  </div>
                  {isAdmin ? (
                    <button
                      onClick={() => setShowTaskForm((current) => !current)}
                      className="zen-button"
                    >
                      {showTaskForm ? "Close task form" : "Create task"}
                    </button>
                  ) : null}
                </div>

                {showTaskForm && isAdmin ? (
                  <div className="mt-6">
                    <CreateTaskForm
                      projectId={projectId}
                      members={project.members}
                      onSuccess={() => {
                        setShowTaskForm(false);
                        void fetchProjectAndTasks();
                      }}
                      onCancel={() => setShowTaskForm(false)}
                    />
                  </div>
                ) : null}

                <div className="mt-6 space-y-4">
                  {tasks.length === 0 ? (
                    <div className="zen-panel-soft p-6 text-sm leading-6 text-[var(--color-muted)]">
                      No tasks yet. {isAdmin ? "Create the first one to set the team in motion." : "Ask a project admin to create the first task."}
                    </div>
                  ) : (
                    tasks.map((task) => {
                      const canUpdateStatus =
                        isAdmin || task.assignedTo?._id === user?._id;

                      return (
                        <TaskCard
                          key={task._id}
                          task={task}
                          canDelete={isAdmin}
                          canUpdateStatus={canUpdateStatus}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleTaskStatusChange}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="zen-panel p-7 sm:p-8">
                <p className="zen-kicker">Team</p>
                <h2 className="mt-2 text-3xl text-[var(--color-text)]">
                  Members and roles
                </h2>

                {isAdmin ? (
                  <form onSubmit={handleAddMember} className="mt-6 space-y-4">
                    <div>
                      <label className="zen-label">Invite by email</label>
                      <input
                        type="email"
                        name="email"
                        value={inviteForm.email}
                        onChange={handleInviteChange}
                        required
                        className="zen-input"
                        placeholder="teammate@example.com"
                      />
                    </div>
                    <div>
                      <label className="zen-label">Role</label>
                      <select
                        name="role"
                        value={inviteForm.role}
                        onChange={handleInviteChange}
                        className="zen-input"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button type="submit" disabled={inviting} className="zen-button w-full">
                      {inviting ? "Inviting..." : "Add member"}
                    </button>
                  </form>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
                    Project admins manage invites and role changes.
                  </p>
                )}

                <div className="mt-6 space-y-3">
                  {project.members.map((member) => {
                    const isOwner = member.user._id === project.createdBy._id;
                    const canRemove =
                      isAdmin &&
                      member.user._id !== project.createdBy._id &&
                      member.user._id !== user?._id;

                    return (
                      <div
                        key={member.user._id}
                        className="zen-panel-soft flex items-center justify-between gap-4 p-4"
                      >
                        <div>
                          <p className="font-semibold text-[var(--color-text)]">
                            {member.user.name}
                          </p>
                          <p className="text-sm text-[var(--color-muted)]">
                            {member.user.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary-strong)]">
                            {isOwner ? "owner" : member.role}
                          </span>
                          {canRemove ? (
                            <button
                              onClick={() => handleRemoveMember(member.user._id)}
                              className="zen-button-danger"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </div>
    </AuthGuard>
  );
}
