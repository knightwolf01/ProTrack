import { getAuthHeader } from "@/lib/token";
import {
  AddProjectMemberRequest,
  CreateProjectRequest,
  ProjectResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const projectsAPI = {
  getAll: async (): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  getById: async (id: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  create: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string, data: CreateProjectRequest): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return response.json();
  },

  addMember: async (
    id: string,
    data: AddProjectMemberRequest
  ): Promise<ProjectResponse> => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/members`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  removeMember: async (id: string, memberId: string): Promise<ProjectResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/projects/${id}/members/${memberId}`,
      {
        method: "DELETE",
        headers: getAuthHeader(),
      }
    );
    return response.json();
  },
};
