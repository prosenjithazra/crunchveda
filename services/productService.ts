import { DryFruitProduct } from "@/json/mock/dryFruits";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: Category | string;
  ratings: {
    average: number;
    count: number;
  };
  badge?: string;
  dietary?: string[];
  sizePrices?: Record<string, number>;
  defaultSize?: string;
  isActive: boolean;
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
    return data;
  },

  getProductBySlug: async (slug: string): Promise<SingleProductResponse> => {
    const res = await fetch(`${API_URL}/products/${slug}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed to fetch product: ${slug}`);
    }
    return data;
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
    return data;
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
    return data;
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
    return data;
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch categories");
    }
    return data;
  },
};

export function mapApiProductToUi(apiProd: Product): DryFruitProduct {
  const categoryName = typeof apiProd.category === "object" && apiProd.category !== null
    ? (apiProd.category as Category).name || ""
    : apiProd.category || "";

  return {
    id: apiProd.slug,
    name: apiProd.name,
    category: categoryName,
    rating: apiProd.ratings?.average || 5.0,
    description: apiProd.description,
    image: apiProd.images?.[0] || "",
    gallery: apiProd.images || [],
    badge: (apiProd.badge === "ORGANIC" || apiProd.badge === "BEST SELLER" ? apiProd.badge : undefined),
    dietary: apiProd.dietary || [],
    sizePrices: apiProd.sizePrices || {},
    defaultSize: apiProd.defaultSize || "500g",
  };
}
