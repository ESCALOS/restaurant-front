import { jwtDecode } from "jwt-decode";
import { redirect } from "react-router-dom";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

interface User {
  username: string;
  token: string;
  role: string;
}

interface TokenPayload {
  sub: string;
  role: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setToken: (token: string) => {
        const { sub, role }: TokenPayload = jwtDecode(token);
        set({
          user: { username: sub, token, role },
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        redirect("/login");
      },
    }),
    {
      name: "auth",
    }
  )
);
