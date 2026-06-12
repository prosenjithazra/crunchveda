import type { ICategory } from "@/types/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type CategoryPayload = {
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive?: boolean;
};

export const categoryService = {
  getAll: async (): Promise<ICategory[]> => {
    const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
    return data.data;
  },

  create: async (payload: CategoryPayload): Promise<ICategory> => {
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create category");
    return data.data;
  },

  update: async (id: string, payload: Partial<CategoryPayload>): Promise<ICategory> => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update category");
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete category");
  },
};
