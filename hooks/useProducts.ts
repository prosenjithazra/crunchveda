import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";

export function useProducts(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    placeholderData: (previousData) => previousData, // Keep previous page data during pagination transitions
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories(),
  });
}

export function useCreateProduct(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => productService.createProduct(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      productService.updateProduct(id, payload, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.data.slug] });
    },
  });
}

export function useDeleteProduct(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useBestsellers() {
  return useQuery({
    queryKey: ["bestsellers"],
    queryFn: () => productService.getBestsellers(),
  });
}
