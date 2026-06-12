import AdminLayout from "@/components/AdminComponents/AdminLayout";
import type { TCmnLayoutProps } from "@/types/commonAll.types";

export default function AdminDashboardLayout({ children }: TCmnLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
