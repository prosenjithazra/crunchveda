import { Metadata } from "next";
import AdminStoreConfigUI from "@/components/AdminComponents/AdminStoreConfigUI";

export const metadata: Metadata = {
  title: "Store Configuration | Crunchveda Admin",
  description: "Manage brand identity, contact details, and social media links for the entire website.",
};

export default function AdminStoreConfigPage() {
  return <AdminStoreConfigUI />;
}
