import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => authService.register(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.data.user);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => authService.login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries();
    },
  });
}

export function useGetMe(token: string, enabled = true) {
  return useQuery({
    queryKey: ["user", token],
    queryFn: () => authService.getMe(token),
    enabled: !!token && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });
}
