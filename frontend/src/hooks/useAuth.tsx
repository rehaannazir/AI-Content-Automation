import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { TOKEN_STORAGE_KEY, getCurrentUser, loginUser, registerUser } from "../services/api";
import type { UserResponse } from "../types/api";

interface AuthContextValue {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await getCurrentUser();
      setUser(profile);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [token, loadProfile]);

  useEffect(() => {
    const handleExpiry = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener("aica:session-expired", handleExpiry);
    return () => window.removeEventListener("aica:session-expired", handleExpiry);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token } = await loginUser(email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setToken(access_token);
    const profile = await getCurrentUser();
    setUser(profile);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await registerUser(name, email, password);
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: Boolean(token && user), isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
