import type { IProduct, IProductCategory, IProductPrice } from "@/types/product";
import { adminAuthService } from "./authService";

const API_URL = "/api";

export type ProductPayload = {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string; // MongoDB ObjectId
  badge?: string;
  dietary?: string[];
  // Send as array format (new backend)
  prices?: Array<{ size: string; price: number }>;
  // Legacy flat map (old backend)
  sizePrices?: Record<string, number>;
  defaultSize?: string;
  isActive?: boolean;
  isBestseller?: boolean;
};


function normalizeProduct(p: any): IProduct {
  if (!p) return p;
  const images = p.images && p.images.length > 0 && p.images[0] !== ""
    ? p.images
    : (p.image && p.image !== "" ? [p.image] : ["/assets/cashews_product.png"]);

  // ── Handle both new prices[] array AND legacy sizePrices map ─────────────────
  let sizePrices: Record<string, number> = {};
  let defaultSize = p.defaultSize || "";

  if (p.prices && Array.isArray(p.prices) && p.prices.length > 0) {
    // New format: [{size, price}] → {size: price}
    for (const entry of p.prices as IProductPrice[]) {
      if (entry.size && entry.price != null) {
        sizePrices[entry.size] = entry.price;
      }
    }
    if (!defaultSize) defaultSize = p.prices[0].size || "500g";
  } else if (p.sizePrices && Object.keys(p.sizePrices).length > 0) {
    // Old format: flat map
    sizePrices = p.sizePrices;
    if (!defaultSize) defaultSize = Object.keys(sizePrices)[0] || "500g";
  }

  if (Object.keys(sizePrices).length === 0 && p.price != null) {
    defaultSize = defaultSize || "500g";
    sizePrices = { [defaultSize]: p.price };
  }

  const slug = p.slug || p.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return {
    ...p,
    slug: slug || p._id || "",
    images,
    sizePrices,
    defaultSize,
    isActive: p.isActive !== false,
    isBestseller: p.isBestseller === true,
  };
}

export const adminProductService = {
  /** Fetch all products (active + inactive) for admin use */
  getAll: async (): Promise<IProduct[]> => {
    const res = await fetch(`${API_URL}/products?all=true&limit=200`, {
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch products");
    const productsArray = Array.isArray(data.data) ? data.data : (data.data?.products || []);
    return productsArray.map(normalizeProduct);
  },

  /** Fetch only bestseller products */
  getBestsellers: async (): Promise<IProduct[]> => {
    const res = await fetch(`${API_URL}/products/bestsellers`, {
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch bestsellers");
    const productsArray = Array.isArray(data.data) ? data.data : (data.data?.products || []);
    return productsArray.map(normalizeProduct);
  },

  /** Fetch all categories for dropdown population */
  getCategories: async (): Promise<IProductCategory[]> => {
    const res = await fetch("/api/categories?all=true", {
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
    return Array.isArray(data.data)
      ? data.data
      : (data.data?.categories || []);
  },

  /** Create a new product */
  create: async (payload: FormData | ProductPayload): Promise<IProduct> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";
    const isFormData = payload instanceof FormData;

    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
      },
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create product");
    return normalizeProduct(data.data?.product || data.data);
  },

  /** Update an existing product by MongoDB _id */
  update: async (id: string, payload: FormData | Partial<ProductPayload>): Promise<IProduct> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";
    const isFormData = payload instanceof FormData;

    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
      },
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update product");
    return normalizeProduct(data.data?.product || data.data);
  },

  /** Promote a product to bestseller by setting badge = "BEST SELLER" and isBestseller = true */
  promoteToBestseller: async (id: string): Promise<IProduct> => {
    return adminProductService.update(id, { badge: "BEST SELLER", isBestseller: true });
  },

  /** Remove bestseller badge and isBestseller status from a product */
  demoteFromBestseller: async (id: string): Promise<IProduct> => {
    return adminProductService.update(id, { badge: "", isBestseller: false });
  },

  /** Toggle product active/inactive status */
  toggleStatus: async (id: string, isActive: boolean): Promise<IProduct> => {
    return adminProductService.update(id, { isActive });
  },

  /** Delete a product permanently */
  remove: async (id: string): Promise<void> => {
    const session = adminAuthService.getSession();
    const token = session?.token || "";
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete product");
  },
};

/** Helper: extract category name from populated or raw category field */
export function getCategoryName(product: IProduct): string {
  if (typeof product.category === "object" && product.category !== null) {
    return (product.category as IProductCategory).name || "Uncategorized";
  }
  return product.category ? String(product.category) : "Uncategorized";
}

/** Helper: extract category id from populated or raw category field */
export function getCategoryId(product: IProduct): string {
  if (typeof product.category === "object" && product.category !== null) {
    return (product.category as IProductCategory)._id || "";
  }
  return product.category ? String(product.category) : "";
}

/** Helper: generate a URL-safe slug from a product name */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
