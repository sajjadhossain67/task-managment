import axios from "axios";
import type { Post, User, CreateTaskInput, UpdateTaskInput } from "./types";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptors for logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  },
);

export const taskApi = {
  getAll: async (): Promise<Post[]> => {
    const { data } = await api.get<Post[]>("/posts");
    return data;
  },

  getById: async (id: number): Promise<Post> => {
    const { data } = await api.get<Post>(`/posts/${id}`);
    return data;
  },

  create: async (
    input: Omit<CreateTaskInput, "status" | "priority">,
  ): Promise<Post> => {
    const { data } = await api.post<Post>("/posts", input);
    return data;
  },

  update: async ({ id, ...input }: UpdateTaskInput): Promise<Post> => {
    const { data } = await api.put<Post>(`/posts/${id}`, input);
    return data;
  },

  patch: async ({ id, ...input }: UpdateTaskInput): Promise<Post> => {
    const { data } = await api.patch<Post>(`/posts/${id}`, input);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>("/users");
    return data;
  },

  getById: async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },
};

export default api;
