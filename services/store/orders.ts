import { readCollection, writeCollection } from "./db";
import type { Order, OrderStatus } from "@/types/user";

export interface OrderItemInput {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  size: string | null;
}

export interface PaymentInfo {
  method: string;
  provider: string;
  reference: string;
  paidAt: string;
}

export interface StoredOrder extends Order {
  payment?: PaymentInfo;
  deliveryMethod?: string;
  pickupLocation?: string;
  shippingAddress?: {
    state?: string;
    city?: string;
    address?: string;
    postalCode?: string;
  };
}

export interface CreateOrderInput {
  userId: string;
  items: OrderItemInput[];
  total: number;
  deliveryMethod: string;
  pickupLocation?: string;
  shippingAddress?: StoredOrder["shippingAddress"];
  payment?: PaymentInfo;
}

function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "ORD-";
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export async function listOrdersByUser(userId: string): Promise<StoredOrder[]> {
  const orders = await readCollection<StoredOrder>("orders", []);
  return orders.filter((o) => o.userId === userId);
}

export async function getOrderById(id: string): Promise<StoredOrder | null> {
  const orders = await readCollection<StoredOrder>("orders", []);
  return orders.find((o) => o.id === id) ?? null;
}

export async function createOrder(input: CreateOrderInput): Promise<StoredOrder> {
  const orders = await readCollection<StoredOrder>("orders", []);
  const now = new Date().toISOString();
  const order: StoredOrder = {
    id: generateOrderId(),
    userId: input.userId,
    items: input.items,
    status: "processing" as OrderStatus,
    total: input.total,
    createdAt: now,
    updatedAt: now,
    deliveryMethod: input.deliveryMethod,
    pickupLocation: input.pickupLocation,
    shippingAddress: input.shippingAddress,
    payment: input.payment,
  };
  await writeCollection("orders", [...orders, order]);
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<StoredOrder | null> {
  const orders = await readCollection<StoredOrder>("orders", []);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
  await writeCollection("orders", orders);
  return orders[idx];
}
