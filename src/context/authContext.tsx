import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import api from "../api/axios.js";
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = () => fetchProfile();

  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
  };

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
