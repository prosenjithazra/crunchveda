import {
  adminModules,
  adminProducts,
  type AdminContentRecord,
  type AdminModule,
  type AdminProductRecord,
} from "@/json/mock/admin";

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const adminContentService = {
  getModules: async (): Promise<AdminModule[]> => {
    await delay();
    return adminModules;
  },

  getModuleById: async (id: string): Promise<AdminModule | undefined> => {
    await delay();
    return adminModules.find(module => module.id === id);
  },

  saveSection: async (section: AdminContentRecord): Promise<AdminContentRecord> => {
    await delay();
    return {
      ...section,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  },

  deleteSection: async (sectionId: string): Promise<{ id: string }> => {
    await delay();
    return { id: sectionId };
  },

  getProducts: async (): Promise<AdminProductRecord[]> => {
    await delay();
    return adminProducts;
  },

  saveProduct: async (product: AdminProductRecord): Promise<AdminProductRecord> => {
    await delay();
    return product;
  },

  deleteProduct: async (productId: string): Promise<{ id: string }> => {
    await delay();
    return { id: productId };
  },
};
