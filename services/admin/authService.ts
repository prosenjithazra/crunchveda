import { adminCredentials } from "@/json/mock/admin";

const ADMIN_SESSION_KEY = "nutriharvest_admin_session";

export type AdminSession = {
  email: string;
  name: string;
  role: string;
  loggedInAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const adminAuthService = {
  login: async ({ email, password }: LoginPayload): Promise<AdminSession> => {
    await new Promise(resolve => setTimeout(resolve, 450));

    if (email !== adminCredentials.email || password !== adminCredentials.password) {
      throw new Error("Invalid admin email or password.");
    }

    const session = {
      email,
      name: "NutriHarvest Admin",
      role: "Content Manager",
      loggedInAt: new Date().toISOString(),
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
