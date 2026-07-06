export interface CartItem {
  id: string; // product ID
  name: string;
  badge: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

// Generate or retrieve a guest session ID for persistent guest carts
const getSessionId = (): string => {
  if (typeof window === "undefined") return "server_default";
  let sid = localStorage.getItem("guestCartId");
  if (!sid) {
    sid = "guest_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("guestCartId", sid);
  }
  return sid;
};

// Helper for API headers
const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || localStorage.getItem("tocken") || "";
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    headers["x-session-id"] = getSessionId();
  }

  return headers;
};

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    try {
      const res = await fetch("/api/products/cart", {
        headers: getHeaders(),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((item: any) => ({
          id: item.productId?._id || item.productId,
          name: item.productId?.name || "Premium Product",
          badge: item.productId?.badge || "CRUNCHVEDA SPECIAL",
          price: item.price || item.productId?.price || 0,
          quantity: item.quantity,
          image: item.productId?.images?.[0] || item.productId?.image || "/assets/images/placeholder.jpg",
          size: item.size || "Default",
        }));
      }
      return [];
    } catch (error) {
      console.error("Failed to load DB cart, falling back to local storage", error);
      // Fallback to local storage if API is offline
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("cartItems");
        if (local) {
          try {
            return JSON.parse(local);
          } catch {}
        }
      }
      return [];
    }
  },

  updateItem: async (productId: string, quantity: number, size?: string, price?: number): Promise<number> => {
    try {
      const res = await fetch(`/api/products/cart/${productId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ quantity, size, price }),
      });
      if (!res.ok) throw new Error("Failed to update cart item");
      const json = await res.json();
      const finalQty = typeof json.quantity === "number" ? json.quantity : quantity;
      
      // Dispatch update event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return finalQty;
    } catch (error) {
      console.error("Failed to update cart item in DB", error);
      return quantity; // return target quantity even if API fails
    }
  },

  removeItem: async (productId: string, size?: string): Promise<void> => {
    try {
      const query = size ? `?size=${encodeURIComponent(size)}` : "";
      await fetch(`/api/products/cart/${productId}${query}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      
      // Dispatch update event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Failed to remove item from cart in DB", error);
    }
  },

  // Save the complete cart to local storage as fallback and cache
  saveLocalFallback: (items: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(items));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }
};
