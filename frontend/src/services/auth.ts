import { api } from "@/lib/api";
import { User, Session, AuthResponse } from "@/types";

export const authService = {
  async register(data: { fullName: string; email: string; password: string }) {
    const response = await api.post("/api/v1/auth/register", data);
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post("/api/v1/auth/login", data);
    return response.data;
  },

  async logout() {
    const response = await api.post("/api/v1/auth/logout");
    return response.data;
  },

  async refresh() {
    const response = await api.post("/api/v1/auth/refresh");
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post("/api/v1/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await api.post("/api/v1/auth/reset-password", { token, password });
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.get(`/api/v1/auth/verify-email?token=${token}`);
    return response.data;
  },

  async getSessions() {
    const response = await api.get("/api/v1/auth/sessions");
    return response.data;
  },

  async revokeSession(sessionId: string) {
    const response = await api.delete(`/api/v1/auth/sessions/${sessionId}`);
    return response.data;
  },

  async logoutAll() {
    const response = await api.post("/api/v1/auth/logout-all");
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get("/api/v1/users/me");
    return response.data;
  },
};
