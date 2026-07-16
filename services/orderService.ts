const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://crunch-veda-backend.onrender.com/api";

export type OrderItemInput = {
  product: string;
  quantity: number;
  price: number;
  size?: string;
};

export type OrderItem = {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
  };
  quantity: number;
  price: number;
  size?: string;
};

export type Order = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | string;
  items: OrderItem[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  shippingAddress: string;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = {
  items: OrderItemInput[];
  shippingAddress: string;
  totalAmount: number;
};

export type OrderResponse = {
  success: boolean;
  message: string;
  data: Order;
};

export type PaginatedOrders = {
  success: boolean;
  message: string;
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export const orderService = {
  createOrder: async (payload: CreateOrderInput, token: string): Promise<OrderResponse> => {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create order");
    }
    return data;
  },

  getMyOrders: async (
    token: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedOrders> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const res = await fetch(`${API_URL}/orders/my-orders?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch your orders");
    }
    return data;
  },

  getOrderById: async (id: string, token: string): Promise<OrderResponse> => {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch order details");
    }
    return data;
  },

  getAllOrders: async (
    token: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedOrders> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const res = await fetch(`${API_URL}/orders?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch all orders");
    }
    return data;
  },

  updateOrderStatus: async (
    id: string,
    status: Order["status"],
    token: string
  ): Promise<OrderResponse> => {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update order status");
    }
    return data;
  },
};
