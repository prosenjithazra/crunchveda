import React from "react";
import AdminOrdersUI from "@/components/AdminComponents/AdminOrdersUI";

export const metadata = {
  title: "Orders Management | Crunchveda Admin",
  description: "View and manage all customer orders in real-time",
};

export default function AdminOrdersPage() {
  return <AdminOrdersUI />;
}
