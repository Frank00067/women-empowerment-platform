import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type UserRole = "learner" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("sheDigital_token");
    const storedUser = localStorage.getItem("sheDigital_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post("/api/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("sheDigital_token", res.data.token);
    localStorage.setItem("sheDigital_user", JSON.stringify(res.data.user));
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) => {
    const res = await axios.post("/api/auth/register", data);
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("sheDigital_token", res.data.token);
    localStorage.setItem("sheDigital_user", JSON.stringify(res.data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("sheDigital_token");
    localStorage.removeItem("sheDigital_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthContextProvider");
  return ctx;
};

