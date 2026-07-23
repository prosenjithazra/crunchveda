/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { mapApiProductToUi, type Product } from "@/services/productService";
import { useUser } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export function useSavedProducts() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token") || localStorage.getItem("tocken");
  };

  const query = useQuery({
    queryKey: ["savedProducts", user?.id || user?._id],
    queryFn: async () => {
      const token = getToken();
      if (!token) return [];

      try {
        const response = await authService.getSavedProducts(token);
        if (response?.data?.savedProducts) {
          return response.data.savedProducts;
        }
      } catch (err) {
        console.warn("API getSavedProducts failed, fallback to user object", err);
      }

      if (user && Array.isArray((user as any).savedProducts)) {
        return (user as any).savedProducts;
      }
      return [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const toggleSaveMutation = useMutation({
    mutationFn: async (productId: string) => {
      const token = getToken();
      if (!token) {
        throw new Error("Please log in to save items to your wishlist");
      }
      return await authService.toggleSaveProduct(productId, token);
    },
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save product");
    },
  });

  const removeSaveMutation = useMutation({
    mutationFn: async (productId: string) => {
      const token = getToken();
      if (!token) {
        throw new Error("Please log in to manage your saved items");
      }
      return await authService.removeSavedProduct(productId, token);
    },
    onSuccess: (data) => {
      toast.success("Removed from saved items");
      queryClient.invalidateQueries({ queryKey: ["savedProducts"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to remove saved product");
    },
  });

  // Map raw API products to UI products
  const rawProducts: Product[] = query.data || [];
  const savedItems = rawProducts
    .filter((p: any) => p && typeof p === "object" && (p._id || p.id))
    .map((p) => {
      const uiProd = mapApiProductToUi(p);
      const categoryName = typeof p.category === "object" && p.category !== null
        ? (p.category as any).name || "SPECIAL SELECTION"
        : typeof p.category === "string" ? p.category : "SPECIAL SELECTION";

      const defaultPrice = uiProd.sizePrices[uiProd.defaultSize] || p.price || 0;

      return {
        id: p._id || (p as any).id || uiProd.id,
        _id: p._id,
        category: categoryName.toUpperCase(),
        name: p.name,
        description: p.description || "",
        price: defaultPrice,
        image: uiProd.image,
        rawProduct: p,
      };
    });

  return {
    savedProducts: savedItems,
    isLoading: query.isLoading,
    refetch: query.refetch,
    toggleSave: (productId: string) => toggleSaveMutation.mutate(productId),
    removeSave: (productId: string) => removeSaveMutation.mutate(productId),
    isToggling: toggleSaveMutation.isPending || removeSaveMutation.isPending,
  };
}
