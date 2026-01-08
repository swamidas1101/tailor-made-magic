import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "tailor" | null;

export interface AuthUser {
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users for demo - replace with API integration
const USERS: Record<string, { password: string; role: UserRole; name: string }> = {
  admin: { password: "admin", role: "admin", name: "Administrator" },
  tailor: { password: "tailor", role: "tailor", name: "Master Tailor" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("stitchcraft_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (username: string, password: string) => {
    const userRecord = USERS[username.toLowerCase()];
    
    if (!userRecord) {
      return { success: false, error: "User not found" };
    }
    
    if (userRecord.password !== password) {
      return { success: false, error: "Invalid password" };
    }
    
    const authUser: AuthUser = {
      username: username.toLowerCase(),
      role: userRecord.role,
      name: userRecord.name,
    };
    
    setUser(authUser);
    localStorage.setItem("stitchcraft_user", JSON.stringify(authUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("stitchcraft_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
