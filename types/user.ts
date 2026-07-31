export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  campus: string;
  faculty: string;
  department: string;
  level: string;
  joinedAt: string;
  verifiedStudent: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  pickupLocation?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  size: string | null;
}

export type OrderStatus = "processing" | "ready_for_pickup" | "delivered" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  processing: "Processing",
  ready_for_pickup: "Ready for Pickup",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  processing: "text-amber-300",
  ready_for_pickup: "text-sky-300",
  delivered: "text-emerald-300",
  cancelled: "text-rose-300",
};
