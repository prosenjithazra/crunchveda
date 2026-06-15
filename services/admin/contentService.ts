import {
  type AdminContentRecord,
  type AdminModule,
  type AdminProductRecord,
} from "@/json/mock/admin";
import { adminAuthService } from "./authService";

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

  getSectionById: async (moduleId: string, sectionId: string): Promise<AdminContentRecord> => {
    const res = await fetch(`${API_URL}/content/modules/${moduleId}/sections/${sectionId}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch content section");
    }
    return data.data;
  },

  getHomeSection: async (sectionName: string): Promise<AdminContentRecord & { content: Record<string, any> }> => {
    const res = await fetch(`${API_URL}/content/home/${sectionName}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch homepage section");
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
    const res = await fetch(`${API_URL}/products?limit=100&all=true`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }
    const products = data.data || [];
    return products.map((p: any) => {
      const categoryName = typeof p.category === "object" && p.category !== null
        ? (p.category as any).name || ""
        : p.category || "";

      return {
        id: p._id,
        name: p.name,
        category: categoryName,
        status: p.isActive ? "Published" : "Draft",
        price: p.price !== undefined ? `$${p.price.toFixed(2)}` : "",
        defaultSize: p.defaultSize || "",
        rating: p.ratings?.average !== undefined ? String(p.ratings.average) : "",
        image: p.images?.[0] || "",
        description: p.description || "",
        badge: p.badge || "",
      };
    });
  },

  saveProduct: async (product: AdminProductRecord): Promise<AdminProductRecord> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";

    // 1. Fetch categories to find or create the category ID matching product.category name
    const catRes = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    const catData = await catRes.json();
    const categoriesList = catData.data || [];

    let categoryId = "";
    const matchedCat = categoriesList.find(
      (c: any) => c.name.toLowerCase() === product.category.trim().toLowerCase()
    );

    if (matchedCat) {
      categoryId = matchedCat._id;
    } else {
      // Create new category if it doesn't exist yet in backend database
      const newCatSlug = product.category.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const createCatRes = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: product.category.trim(),
          slug: newCatSlug,
          description: `All products related to ${product.category.trim()}`,
        }),
      });
      const createCatData = await createCatRes.json();
      if (!createCatRes.ok) {
        throw new Error(createCatData.message || "Failed to auto-create category on backend");
      }
      categoryId = createCatData.data._id;
    }

    // Parse values safely
    const priceNum = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;
    const ratingNum = parseFloat(product.rating) || 5;

    // Prepare Product payload
    const payload = {
      name: product.name,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: product.description,
      price: priceNum,
      stock: 100,
      images: [product.image].filter(Boolean),
      category: categoryId,
      ratings: {
        average: ratingNum,
        count: 10,
      },
      badge: product.badge || "",
      defaultSize: product.defaultSize || "500g",
      sizePrices: {
        [product.defaultSize || "500g"]: priceNum,
      },
      isActive: product.status === "Published",
    };

    const isNew = product.id.startsWith("product-");
    const url = isNew ? `${API_URL}/products` : `${API_URL}/products/${product.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to save product on backend");
    }

    const savedProduct = data.data;
    return {
      id: savedProduct._id,
      name: savedProduct.name,
      category: product.category,
      status: savedProduct.isActive ? "Published" : "Draft",
      price: `$${savedProduct.price.toFixed(2)}`,
      defaultSize: savedProduct.defaultSize || "",
      rating: String(savedProduct.ratings?.average || 5.0),
      image: savedProduct.images?.[0] || "",
      description: savedProduct.description || "",
      badge: savedProduct.badge || "",
    };
  },

  deleteProduct: async (productId: string): Promise<{ id: string }> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";

    const res = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete product on backend");
    }

    return { id: productId };
  },
};
