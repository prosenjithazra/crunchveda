import { adminCredentials } from "@/json/mock/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const ADMIN_SESSION_KEY = "nutriharvest_admin_session";

export type AdminSession = {
  email: string;
  name: string;
  role: string;
  loggedInAt: string;
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const adminAuthService = {
  login: async ({ email, password }: LoginPayload): Promise<AdminSession> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Invalid admin email or password.");
    }

    const { user, accessToken } = data.data;
    if (user.role !== "admin") {
      throw new Error("Access denied. Admin privileges required.");
    }

    const session: AdminSession = {
      email: user.email,
      name: user.name,
      role: user.role,
      loggedInAt: new Date().toISOString(),
      token: accessToken,
    };

    window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));

    return session;
  },

  logout: () => {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
  },

  getSession: (): AdminSession | null => {
    const rawSession = window.localStorage.getItem(ADMIN_SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AdminSession;
    } catch {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
  },
};
