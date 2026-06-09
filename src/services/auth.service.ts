import { LoginCredentials, SignupOnboarding } from "../types/auth.types";
import { UserProfile } from "../types/user.types";
import { useBrainStore } from "../store/useBrainStore";

const API = "/api/auth";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export const AuthService = {
  // Send OTP to email for signup
  async sendSignupOTP(email: string): Promise<void> {
    await apiFetch(`${API}/signup/send-otp`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Complete signup with OTP + password
  async signup(data: SignupOnboarding & { code: string; password: string }): Promise<boolean> {
    const result = await apiFetch<{ user: UserProfile }>(`${API}/signup`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (result.user) {
      useBrainStore.getState().setUser(result.user);
    }
    return true;
  },

  // Login with email + password
  async login(credentials: LoginCredentials): Promise<boolean> {
    const result = await apiFetch<{ user: UserProfile }>(`${API}/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (result.user) {
      useBrainStore.getState().setUser(result.user);
    }
    return true;
  },

  // Logout
  async logout(): Promise<void> {
    await apiFetch(`${API}/logout`, { method: "POST" });
    useBrainStore.getState().clearUser();
  },

  // Fetch current user from JWT cookie
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const result = await apiFetch<{ user: UserProfile }>(`${API}/me`);
      if (result.user) {
        useBrainStore.getState().setUser(result.user);
        return result.user;
      }
      return null;
    } catch {
      return null;
    }
  },

  // Send OTP for password reset
  async sendForgotPasswordOTP(email: string): Promise<void> {
    await apiFetch(`${API}/forgot-password/send-otp`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Reset password with OTP
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await apiFetch(`${API}/forgot-password/reset`, {
      method: "POST",
      body: JSON.stringify({ email, code, newPassword }),
    });
  },
};
