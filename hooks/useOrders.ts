import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService, CreateOrderInput, Order } from "../services/orderService";

export function useCreateOrder(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderInput) => orderService.createOrder(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "my-orders"] });
    },
  });
}

export function useMyOrders(token: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["orders", "my-orders", token, params],
    queryFn: () => orderService.getMyOrders(token, params),
    enabled: !!token,
    placeholderData: (previousData) => previousData,
  });
}

export function useOrderById(id: string, token: string) {
  return useQuery({
    queryKey: ["orders", "detail", id, token],
    queryFn: () => orderService.getOrderById(id, token),
    enabled: !!id && !!token,
  });
}

export function useAllOrders(token: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["orders", "all", token, params],
    queryFn: () => orderService.getAllOrders(token, params),
    enabled: !!token,
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateOrderStatus(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      orderService.updateOrderStatus(id, status, token),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "detail", variables.id] });
    },
  });
}
