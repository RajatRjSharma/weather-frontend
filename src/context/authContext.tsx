import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import api, { setTokens, clearTokens } from "../api/axios.js";
import type { AuthContextType, UserProfile } from "../types/auth.js";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/profile");
      if (res.data.status) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // login accepts optional tokens
  const login = async (
    accessToken?: string,
    refreshToken?: string
  ): Promise<void> => {
    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      // load tokens from localStorage if available
      const at = localStorage.getItem("accessToken");
      const rt = localStorage.getItem("refreshToken");
      if (at && rt) {
        setTokens(at, rt);
      } else {
        setUser(null);
        setLoading(false);
        return;
      }
    }
    await fetchProfile();
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } finally {
      clearTokens();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  // On mount, attempt login without args to init from localStorage
  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
