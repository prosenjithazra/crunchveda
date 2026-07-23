/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, UserProfile } from "../services/authService";
import { useEffect } from "react";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      authService.register(payload),
    onSuccess: (data) => {
      const token =
        data.token || data.tocken || data.data?.accessToken || data.data?.token;
      let user = (data as any).user || (data.data as any)?.user || (data.data?.email ? data.data : null);
      if (user) {
        const u = user as any;
        const phone = u.phone || u.phoneNumber || u.mobile || u.mobileNumber || u.phone_number || u.contact || "";
        user = { ...user, id: u.id || u._id, phone };
      }

      if (typeof window !== "undefined") {
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("tocken", token);
        }
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      }
      if (user) {
        queryClient.setQueryData(["user"], user);
      }
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      authService.login(payload),
    onSuccess: (data) => {
      const token =
        data.token || data.tocken || data.data?.accessToken || data.data?.token;
      let user = (data as any).user || (data.data as any)?.user || (data.data?.email ? data.data : null);
      if (user) {
        const u = user as any;
        const phone = u.phone || u.phoneNumber || u.mobile || u.mobileNumber || u.phone_number || u.contact || "";
        user = { ...user, id: u.id || u._id, phone };
      }

      if (typeof window !== "undefined") {
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("tocken", token);
        }
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      }
      if (user) {
        queryClient.setQueryData(["user"], user);
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        return await authService.logout();
      } catch (e) {
        console.warn("API logout failed, performing local logout:", e);
        return { success: true, message: "Logged out locally" };
      }
    },
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("tocken");
        localStorage.removeItem("user");
      }
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries();
    },
  });
}

export function useGetMe(token: string, enabled = true) {
  return useQuery({
    queryKey: ["user", token],
    queryFn: () => authService.getMe(token),
    enabled: !!token && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUser() {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<UserProfile | null>({
    queryKey: ["user"],
    queryFn: async () => {
      if (typeof window === "undefined") return null;
      const token =
        localStorage.getItem("token") || localStorage.getItem("tocken");
      if (!token) return null;

      try {
        const response = await authService.getMe(token);
        if (response) {
          const rawUser = (response as any).user || (response.data as any)?.user || response.data || response;
          if (rawUser && (rawUser.email || rawUser.name || rawUser._id || rawUser.id)) {
            const phone = rawUser.phone || rawUser.phoneNumber || rawUser.mobile || rawUser.mobileNumber || rawUser.phone_number || rawUser.contact || "";
            const userData = { ...rawUser, id: rawUser.id || rawUser._id, phone };
            localStorage.setItem("user", JSON.stringify(userData));
            return userData;
          }
        }
      } catch (err: any) {
        console.error("useUser fetch failed:", err);
        // Handle expired token
        if (
          err.message &&
          (err.message.includes("401") ||
            err.message.toLowerCase().includes("unauthorized") ||
            err.message.toLowerCase().includes("jwt expired"))
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          return null;
        }

        // Fallback to localStorage user if there is a network error (server offline)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            return JSON.parse(storedUser);
          } catch (e) {
            console.error("Failed to parse stored user", e);
          }
        }
      }
      return null;
    },
    initialData: () => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            return JSON.parse(storedUser);
          } catch (e) {
            console.error("Failed to parse stored user", e);
          }
        }
      }
      return null;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return { user: user || null, isLoading, refetch };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      phone: string;
      avatar?: string;
      profilePicture?: string;
    }) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("tocken")
          : null;
      if (!token) throw new Error("No authorization token found");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://crunch-veda-backend.onrender.com/api"}/auth/profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );
        if (res.ok) {
          const data = await res.json();
          return data.data;
        }
      } catch (e) {
        console.warn(
          "Could not connect to update profile API, using local simulation:",
          e,
        );
      }
      return payload; // Fallback to local update
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["user"], (old: any) => {
        if (!old) return old;
        const next = { ...old, ...updatedData };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(next));
        }
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useInitializeAuth() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          queryClient.setQueryData(["user"], parsedUser);
        } catch (e) {
          console.error("Auth initialization failed", e);
        }
      }
    }
  }, [queryClient]);
}
