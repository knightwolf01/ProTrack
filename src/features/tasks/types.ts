import { Project } from "@/features/projects/types";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface TaskUser {
  _id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string | Pick<Project, "_id" | "name">;
  assignedTo?: TaskUser | null;
  createdBy?: TaskUser | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  assignedTo?: string;
  status: TaskStatus;
  dueDate?: string;
}

export interface TaskResponse {
  success: boolean;
  data?: Task | Task[];
  message?: string;
  error?: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  assignedToMe: number;
  inProgressTasks: number;
  todoTasks: number;
  recentProjects: Project[];
  myTasks: Task[];
}

export interface DashboardResponse {
  success: boolean;
  data?: DashboardStats;
  message?: string;
  error?: string;
}
