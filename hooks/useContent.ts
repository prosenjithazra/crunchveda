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

export function useContentSection(moduleId: string, sectionId: string) {
  return useQuery({
    queryKey: ["content-section", moduleId, sectionId],
    queryFn: () => adminContentService.getSectionById(moduleId, sectionId),
    enabled: !!moduleId && !!sectionId,
  });
}

export function useHomeSection(sectionName: string) {
  return useQuery({
    queryKey: ["home-section", sectionName],
    queryFn: () => adminContentService.getHomeSection(sectionName),
    enabled: !!sectionName,
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
      queryClient.invalidateQueries({ queryKey: ["content-section", variables.moduleId, variables.section.id] });
      if (variables.moduleId === "home") {
        const name = variables.section.id.replace("home-", "");
        queryClient.invalidateQueries({ queryKey: ["home-section", name] });
      }
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
      queryClient.invalidateQueries({ queryKey: ["content-section", variables.moduleId, variables.sectionId] });
      if (variables.moduleId === "home") {
        const name = variables.sectionId.replace("home-", "");
        queryClient.invalidateQueries({ queryKey: ["home-section", name] });
      }
    },
  });
}
