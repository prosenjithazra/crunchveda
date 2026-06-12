import {
  adminProducts,
  type AdminContentRecord,
  type AdminModule,
  type AdminProductRecord,
} from "@/json/mock/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const adminContentService = {
  getModules: async (): Promise<AdminModule[]> => {
    const res = await fetch(`${API_URL}/content/modules`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch content modules");
    }
    return data.data;
  },

  getModuleById: async (id: string): Promise<AdminModule | undefined> => {
    const res = await fetch(`${API_URL}/content/modules/${id}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch content module");
    }
    return data.data;
  },

  saveSection: async (section: AdminContentRecord, moduleId?: string): Promise<AdminContentRecord> => {
    const resolvedModuleId = moduleId || (section.id.includes("-") ? section.id.split("-")[0] : "home");
    const res = await fetch(`${API_URL}/content/sections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moduleId: resolvedModuleId, section }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to save section");
    }
    return data.data;
  },

  deleteSection: async (sectionId: string, moduleId?: string): Promise<{ id: string }> => {
    const resolvedModuleId = moduleId || (sectionId.includes("-") ? sectionId.split("-")[0] : "home");
    const res = await fetch(`${API_URL}/content/modules/${resolvedModuleId}/sections/${sectionId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete section");
    }
    return data.data;
  },

  getProducts: async (): Promise<AdminProductRecord[]> => {
    // Keep products as local mock for now since it's only for mock commerce panel
    await new Promise(resolve => setTimeout(resolve, 300));
    return adminProducts;
  },

  saveProduct: async (product: AdminProductRecord): Promise<AdminProductRecord> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return product;
  },

  deleteProduct: async (productId: string): Promise<{ id: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { id: productId };
  },
};
