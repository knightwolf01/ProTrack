import { getAuthHeader } from "@/lib/token";
import { CreateTaskRequest, DashboardResponse, TaskResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const tasksAPI = {
  getByProject: async (projectId: string): Promise<TaskResponse> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  create: async (projectId: string, data: CreateTaskRequest): Promise<TaskResponse> => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (taskId: string, data: Partial<CreateTaskRequest>): Promise<TaskResponse> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (taskId: string): Promise<TaskResponse> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return response.json();
  },

  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await fetch(`${API_BASE_URL}/tasks/dashboard`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },
};
