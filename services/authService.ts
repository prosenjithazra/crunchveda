const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.6.128:5000/api";

export type UserProfile = {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  createdAt: string;
  avatar?: string;
  phone: string;
  cartItems?: Array<{ product: string; quantity: number; _id?: string }>;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
  tocken?: string;
  data: {
    id?: string;
    name?: string;
    email?: string;
    role?: "admin" | "customer";
    avatar?: string;
    phone?: string;
    createdAt?: string;
    token?: string;
    tocken?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      role: "admin" | "customer";
      avatar?: string;
      phone: string;
      createdAt?: string;
    };
    accessToken?: string;
  };
};

export type RefreshResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
};

export type ProfileResponse = {
  success: boolean;
  message: string;
  data: UserProfile;
};

export const authService = {
  register: async (payload: Record<string, unknown>): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to register");
    }
    return data;
  },

  login: async (payload: Record<string, unknown>): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to login");
    }
    return data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to logout");
    }
    return data;
  },

  getMe: async (token: string): Promise<ProfileResponse> => {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to get user profile");
    }
    return data;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }
    return data;
  },
};
