import { create } from "zustand";
import type { User } from "../types/user.type";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;

  setUser: (user: User) => void;
  setIsAuthenticating: (state: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthenticating: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setIsAuthenticating: (state: boolean) =>
    set({
      isAuthenticating: state,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;
