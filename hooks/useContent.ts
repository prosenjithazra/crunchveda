import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminContentService } from "@/services/admin/contentService";
import type { AdminContentRecord } from "@/json/mock/admin";

export function useContentModules() {
  return useQuery({
    queryKey: ["content-modules"],
    queryFn: () => adminContentService.getModules(),
  });
}

export function useContentModule(moduleId: string) {
  return useQuery({
    queryKey: ["content-module", moduleId],
    queryFn: () => adminContentService.getModuleById(moduleId),
    enabled: !!moduleId,
  });
}

export function useSaveContentSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ section, moduleId }: { section: AdminContentRecord; moduleId: string }) =>
      adminContentService.saveSection(section, moduleId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["content-module", variables.moduleId] });
      queryClient.invalidateQueries({ queryKey: ["content-modules"] });
    },
  });
}

export function useDeleteContentSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, moduleId }: { sectionId: string; moduleId: string }) =>
      adminContentService.deleteSection(sectionId, moduleId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["content-module", variables.moduleId] });
      queryClient.invalidateQueries({ queryKey: ["content-modules"] });
    },
  });
}
