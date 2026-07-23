import React from "react";
import AdminUsersUI from "@/components/AdminComponents/AdminUsersUI";

export const metadata = {
  title: "User Management | Crunchveda Admin",
  description: "View and manage all registered customer and admin accounts",
};

export default function AdminUsersPage() {
  return <AdminUsersUI />;
}
