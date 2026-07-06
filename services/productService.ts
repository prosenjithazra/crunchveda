import { DryFruitProduct } from "@/json/mock/dryFruits";

const API_URL = "/api";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  productCount?: number;
};

export type ProductPrice = {
  _id?: string;
  size: string;
  price: number;
};

export type Product = {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price?: number;         // legacy base price
  stock: number;
  images?: string[];
  image?: string;         // legacy singular image
  category?: Category | string | null;
  ratings?: {
    average: number;
    count: number;
  };
  rating?: {
    number: number;
    total: number;
    _id?: string;
  };
  badge?: string;
  dietary?: string[];
  // new format — array of {size, price}
  prices?: ProductPrice[];
  // old format — flat map
  sizePrices?: Record<string, number>;
  defaultSize?: string;
  isActive?: boolean;
  isBestseller?: boolean;
  createdAt: string;
};

export type PaginatedProducts = {
  success: boolean;
  message: string;
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type SingleProductResponse = {
  success: boolean;
  message: string;
  data: Product;
};

export type CategoriesResponse = {
  success: boolean;
  message: string;
  data: Category[];
};

export const productService = {
  getProducts: async (params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedProducts> => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.category) query.append("category", params.category);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const res = await fetch(`${API_URL}/products?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }
    const isSuccess = data.status === "success" || data.success === true;
    const productsArray = Array.isArray(data.data) ? data.data : (data.data?.products || []);
    return {
      success: isSuccess,
      message: data.message || "Products fetched successfully",
      data: productsArray,
      meta: {
        page: data.meta?.page || params?.page || 1,
        limit: data.meta?.limit || params?.limit || productsArray.length,
        total: data.meta?.total || productsArray.length,
      },
    };
  },

  getProductBySlug: async (slug: string): Promise<SingleProductResponse> => {
    const res = await fetch(`${API_URL}/products/${slug}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch product: ${slug}`);
    }
    const isSuccess = data.status === "success" || data.success === true;
    const productObj = data.data?.product || data.data;
    return {
      success: isSuccess,
      message: data.message || "Product fetched successfully",
      data: productObj,
    };
  },

  createProduct: async (payload: Record<string, unknown>, token: string): Promise<SingleProductResponse> => {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create product");
    }
    const isSuccess = data.status === "success" || data.success === true;
    const productObj = data.data?.product || data.data;
    return {
      success: isSuccess,
      message: data.message || "Product created successfully",
      data: productObj,
    };
  },

  updateProduct: async (
    id: string,
    payload: Record<string, unknown>,
    token: string
  ): Promise<SingleProductResponse> => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update product");
    }
    const isSuccess = data.status === "success" || data.success === true;
    const productObj = data.data?.product || data.data;
    return {
      success: isSuccess,
      message: data.message || "Product updated successfully",
      data: productObj,
    };
  },

  deleteProduct: async (id: string, token: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete product");
    }
    const isSuccess = data.status === "success" || data.success === true;
    return {
      success: isSuccess,
      message: data.message || "Product deleted successfully",
    };
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch categories");
    }
    const isSuccess = data.status === "success" || data.success === true;
    const categoriesArray = Array.isArray(data.data) ? data.data : (data.data?.categories || []);
    return {
      success: isSuccess,
      message: data.message || "Categories fetched successfully",
      data: categoriesArray,
    };
  },

  getBestsellers: async (): Promise<{ success: boolean; data: Product[] }> => {
    try {
      const res = await fetch(`${API_URL}/products/bestsellers`);
      const data = await res.json();
      if (res.ok && data.status !== "error") {
        const isSuccess = data.status === "success" || data.success === true;
        const productsArray = Array.isArray(data.data) ? data.data : (data.data?.products || []);
        return {
          success: isSuccess,
          data: productsArray,
        };
      }
    } catch (err) {
      console.warn("Bestsellers endpoint failed, using local fallback...", err);
    }

    // Proxy Fallback: fetch all active products and filter by badge
    const res = await fetch(`${API_URL}/products?limit=200`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch bestsellers");
    }
    const productsArray = Array.isArray(data.data) ? data.data : (data.data?.products || []);
    const filtered = productsArray.filter((p: any) => p.isBestseller === true || (p.badge && /best\s*seller/i.test(p.badge)));
    return {
      success: true,
      data: filtered,
    };
  },
};

export function mapApiProductToUi(apiProd: Product): DryFruitProduct {
  const categoryName = typeof apiProd.category === "object" && apiProd.category !== null
    ? (apiProd.category as Category).name || ""
    : apiProd.category || "";

  let image = apiProd.image || apiProd.images?.[0] || "";
  if (!image || image === "") {
    image = "/assets/cashews_product.png";
  }

  const gallery = apiProd.images && apiProd.images.length > 0 && apiProd.images[0] !== ""
    ? apiProd.images
    : (apiProd.image && apiProd.image !== "" ? [apiProd.image] : ["/assets/cashews_product.png"]);

  // ── Handle both new `prices` array AND legacy `sizePrices` map ──────────────
  let sizePrices: Record<string, number> = {};
  let defaultSize = apiProd.defaultSize || "";

  if (apiProd.prices && apiProd.prices.length > 0) {
    // New format: convert [{size, price}] → {size: price}
    for (const entry of apiProd.prices) {
      if (entry.size && entry.price != null) {
        sizePrices[entry.size] = entry.price;
      }
    }
    if (!defaultSize) {
      defaultSize = apiProd.prices[0].size;
    }
  } else if (apiProd.sizePrices && Object.keys(apiProd.sizePrices).length > 0) {
    // Old format: use map directly
    sizePrices = apiProd.sizePrices;
    if (!defaultSize) {
      defaultSize = Object.keys(sizePrices)[0] || "500g";
    }
  }

  // Last fallback: use base price field
  if (Object.keys(sizePrices).length === 0) {
    const basePrice = apiProd.price ?? 0;
    defaultSize = defaultSize || "500g";
    sizePrices = { [defaultSize]: basePrice };
  }

  const slug = apiProd.slug || apiProd.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const id = slug || apiProd._id || "";

  return {
    id,
    _id: apiProd._id,
    name: apiProd.name,
    category: categoryName,
    rating: apiProd.rating?.number ?? apiProd.ratings?.average ?? 5.0,
    description: apiProd.description,
    image,
    gallery,
    badge: apiProd.badge || "",
    dietary: apiProd.dietary || [],
    sizePrices,
    defaultSize,
    stock: apiProd.stock,
  };
}

export type BadgeInfo = {
  text: string;
  type: string;
};

export const getBadgeInfo = (badgeStr?: string): BadgeInfo | null => {
  if (!badgeStr) return null;
  const upper = badgeStr.toUpperCase().trim();
  if (upper === "BEST SELLER" || upper === "BEST_SELLER" || upper === "BESTSELLER") {
    return { text: "Best Seller", type: "bestseller" };
  }
  if (upper === "ORGANIC") {
    return { text: "Organic", type: "organic" };
  }
  if (upper === "DISCOUNT" || upper === "NEW LAUNCH" || upper === "NEW_LAUNCH") {
    return { text: "New Launch", type: "discount" };
  }
  if (upper === "TOP RATED" || upper === "TOP_RATED" || upper === "TOPRATED") {
    return { text: "Top Rated", type: "toprated" };
  }
  return { text: badgeStr, type: badgeStr.toLowerCase().replace(/[^a-z0-9]+/g, "") };
};
