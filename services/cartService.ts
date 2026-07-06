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
      if (typeof window === "undefined") return [];

      const token = localStorage.getItem("token") || localStorage.getItem("tocken");
      if (token) {
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.user?.cartItems) {
            const dbItems = json.data.user.cartItems;
            const resolved = await Promise.all(
              dbItems.map(async (item: any) => {
                let productData = item.product;
                // If product is only ID, fetch it
                if (typeof productData === "string") {
                  try {
                    const productRes = await fetch(`/api/products/${productData}`, { cache: "no-store" });
                    if (productRes.ok) {
                      const pJson = await productRes.json();
                      productData = pJson?.data?.product || pJson?.data;
                    }
                  } catch (e) {
                    console.error("Failed to resolve product data for ID:", productData, e);
                  }
                }

                if (productData && typeof productData === "object") {
                  return {
                    id: productData._id || item.product,
                    name: productData.name || "Premium Product",
                    badge: productData.badge || "Organic Collection",
                    price: item.price || productData.price || 0,
                    quantity: item.quantity,
                    image: productData.images?.[0] || productData.image || "/assets/images/placeholder.jpg",
                    size: item.size || productData.defaultSize || "500g",
                  };
                }

                return {
                  id: item.product,
                  name: "Premium Product",
                  badge: "CRUNCHVEDA SPECIAL",
                  price: item.price || 0,
                  quantity: item.quantity,
                  image: "/assets/images/placeholder.jpg",
                  size: item.size || "Default",
                };
              })
            );
            return resolved;
          }
        }
      }

      // Guest fallback
      const local = localStorage.getItem("cartItems");
      if (local) {
        try {
          return JSON.parse(local);
        } catch {}
      }
      return [];
    } catch (error) {
      console.error("Failed to load DB cart, falling back to local storage", error);
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
      const res = await fetch(`/api/cart/${productId}`, {
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
      await fetch(`/api/cart/${productId}${query}`, {
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
    }
  }
};
