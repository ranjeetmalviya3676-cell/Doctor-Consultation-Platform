import { User } from "@/lib/types";
import {
  getWithAuth,
  postWithoutAuth,
  putWithAuth,
} from "@/service/httpService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  setUser: (user: User, token: string) => void;
  clearError: () => void;
  logout: () => void;

  loginDoctor: (email: string, password: string) => Promise<void>;
  loginPatient: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  registerDoctor: (data: any) => Promise<void>;
  registerPatient: (data: any) => Promise<void>;
  fetchProfile: () => Promise<User | null>;
  updateProfile: (data: any) => Promise<void>;
}

export const userAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      },

      clearError: () => set({ error: null }),

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("auth-storage");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      loginDoctor: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("/auth/doctor/login", {
            email,
            password,
          });

          get().setUser(response.data.user, response.data.token);
        } catch (error: any) {
          set({ error: error.message || "Doctor login failed" });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      loginPatient: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("/auth/patient/login", {
            email,
            password,
          });

          get().setUser(response.data.user, response.data.token);
        } catch (error: any) {
          set({ error: error.message || "Patient login failed" });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      loginAdmin: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("/admin/auth/login", {
            email,
            password,
          });

          get().setUser(response.data.user, response.data.token);
        } catch (error: any) {
          set({ error: error.message || "Admin login failed" });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      registerDoctor: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("/auth/doctor/register", data);

          get().setUser(response.data.user, response.data.token);
        } catch (error: any) {
          set({ error: error.message || "Doctor registration failed" });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      registerPatient: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("/auth/patient/register", data);

          get().setUser(response.data.user, response.data.token);
        } catch (error: any) {
          set({ error: error.message || "Patient registration failed" });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async (): Promise<User | null> => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error("No user found");

          const endPoint =
            user.type === "doctor"
              ? "/doctor/me"
              : user.type === "patient"
              ? "/patient/me"
              : "/admin/profile";

          const response = await getWithAuth(endPoint);

          const mergedUser = { ...user, ...response.data };

          set({ user: mergedUser });
          localStorage.setItem("user", JSON.stringify(mergedUser));

          return response.data;
        } catch (error: any) {
          set({ error: error.message || "Failed to fetch profile" });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (data) => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error("No user found");

          const endPoint =
            user.type === "doctor"
              ? "/doctor/onboarding/update"
              : "/patient/onboarding/update";

          const response = await putWithAuth(endPoint, data);

          const updatedUser = { ...user, ...response.data };

          set({ user: updatedUser });
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error: any) {
          set({ error: error.message || "Profile update failed" });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);