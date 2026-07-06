import type { ICategory } from "@/types/category";
import { adminAuthService } from "./authService";

const API_URL = "/api";

export type CategoryPayload = {
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive?: boolean;
};

export const categoryService = {
  /** Fetch all categories (proxy normalizes both backend response shapes) */
  getAll: async (): Promise<ICategory[]> => {
    const res = await fetch(`${API_URL}/categories?all=true`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
    // Proxy always returns flat { success: true, data: [...] }
    // but we handle both just in case
    return Array.isArray(data.data)
      ? data.data
      : (data.data?.categories || []);
  },

  /** Create a new category */
  create: async (payload: FormData | CategoryPayload): Promise<ICategory> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";
    const isFormData = payload instanceof FormData;

    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
      },
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create category");
    // Proxy returns { success: true, data: <categoryObject> }
    return data.data?.category || data.data;
  },

  /** Update an existing category by ID */
  update: async (id: string, payload: FormData | Partial<CategoryPayload>): Promise<ICategory> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";
    const isFormData = payload instanceof FormData;

    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
      },
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update category");
    // Proxy returns { success: true, data: <categoryObject> }
    return data.data?.category || data.data;
  },

  /** Delete a category by ID */
  remove: async (id: string): Promise<void> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete category");
  },
};
