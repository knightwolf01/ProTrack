import { User } from "@/features/auth/types";

export type ProjectMemberRole = "admin" | "member";

export interface ProjectMember {
  user: Pick<User, "_id" | "name" | "email">;
  role: ProjectMemberRole;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: Pick<User, "_id" | "name" | "email">;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface AddProjectMemberRequest {
  email: string;
  role: ProjectMemberRole;
}

export interface ProjectResponse {
  success: boolean;
  data?: Project | Project[];
  message?: string;
  error?: string;
}
