const ADMIN_SESSION_KEY = "crunchveda_admin_session";

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

type AdminLoginResponse = {
  message?: string;
  token?: string;
  tocken?: string;
  accessToken?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    avatar?: string;
    createdAt?: string;
  };
  data?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    avatar?: string;
    createdAt?: string;
    token?: string;
    tocken?: string;
    accessToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
      phone?: string;
      avatar?: string;
      createdAt?: string;
    };
  };
};

export const adminAuthService = {
  login: async ({ email, password }: LoginPayload): Promise<AdminSession> => {
    const res = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await res.json()) as AdminLoginResponse;
    if (!res.ok) {
      throw new Error(data.message || "Invalid admin email or password.");
    }

    const token = data.token || data.tocken || data.accessToken || data.data?.accessToken || data.data?.token;
    const user = data.user || data.data?.user || (data.data?.email ? {
      id: data.data.id || "",
      name: data.data.name || "",
      email: data.data.email || "",
      role: data.data.role || "admin",
      phone: data.data.phone || "",
      avatar: data.data.avatar || "",
      createdAt: data.data.createdAt || new Date().toISOString(),
    } : {
      id: "",
      name: "Admin",
      email,
      role: "admin",
      phone: "",
      avatar: "",
      createdAt: new Date().toISOString(),
    });

    if (user.role && user.role !== "admin") {
      throw new Error("Access denied. Admin privileges required.");
    }

    const session: AdminSession = {
      email: user.email || email,
      name: user.name || "Admin",
      role: user.role || "admin",
      loggedInAt: new Date().toISOString(),
      token: token || "",
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      if (token) {
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("tocken", token);
      }
      window.localStorage.setItem("user", JSON.stringify(user));
    }

    return session;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("tocken");
      window.localStorage.removeItem("user");
    }
  },

  getSession: (): AdminSession | null => {
    if (typeof window === "undefined") {
      return null;
    }
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
