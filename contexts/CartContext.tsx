/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useUser } from "@/hooks/useAuth";
import { cartService, type CartItem } from "@/services/cartService";

export interface ProfileCartItem {
  product: string;
  quantity: number;
  _id?: string;
}

export interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  cartItems: ProfileCartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  userProfile: UserProfileData | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateItem: (
    productId: string,
    quantity: number,
    size?: string,
    price?: number,
  ) => Promise<void>;
  removeItem: (productId: string, size?: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const prevEmailRef = useRef<string | undefined>(undefined);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      if (typeof window === "undefined") return;

      const items = await cartService.getCart();
      setCartItems(items);
      setCartCount(items.length);

      const token =
        localStorage.getItem("token") || localStorage.getItem("tocken");
      if (token) {
        // Authenticated user: Load profile from local /api/profile proxy
        const res = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.user) {
            const profile = json.data.user as UserProfileData;
            setUserProfile(profile);
            setIsLoading(false);
            return;
          }
        }
      }

      setUserProfile(null);
    } catch (error) {
      console.error(
        "CartProvider: Error fetching profile or syncing cart:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update item wrapper
  const updateItem = useCallback(
    async (
      productId: string,
      quantity: number,
      size?: string,
      price?: number,
    ) => {
      try {
        await cartService.updateItem(productId, quantity, size, price);
        // Fetch profile again to get DB sync.
        await fetchProfile();
      } catch (error) {
        console.error("CartProvider: Error updating item:", error);
      }
    },
    [fetchProfile],
  );

  // Remove item wrapper
  const removeItem = useCallback(
    async (productId: string, size?: string) => {
      try {
        await cartService.removeItem(productId, size);
        await fetchProfile();
      } catch (error) {
        console.error("CartProvider: Error removing item:", error);
      }
    },
    [fetchProfile],
  );

  // Sync profile on mount and when auth state (user hook) changes
  useEffect(() => {
    console.log("CartProvider: sync effect triggered", {
      userEmail: user?.email,
      prevEmail: prevEmailRef.current
    });
    if (user?.email !== prevEmailRef.current) {
      console.log("CartProvider: email changed, fetching profile...");
      prevEmailRef.current = user?.email;
      fetchProfile();
    }
  }, [user?.email, fetchProfile]);

  // Listen to custom cart updated event (fired by cartService)
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("cartUpdated", fetchProfile);
    return () => {
      window.removeEventListener("cartUpdated", fetchProfile);
    };
  }, [fetchProfile]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        userProfile,
        isLoading,
        fetchProfile,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
