import type { Order } from "@/types/user";
import { products } from "@/lib/products";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMockOrders(userId: string): Order[] {
  const statuses = ["processing", "ready_for_pickup", "delivered", "cancelled"] as const;
  const selectedProducts = products.slice(0, 6);

  return [
    {
      id: `ord-${userId}-001`,
      userId,
      items: [
        {
          productId: selectedProducts[0].id,
          title: selectedProducts[0].title,
          image: selectedProducts[0].image,
          price: selectedProducts[0].price,
          quantity: 1,
          size: selectedProducts[0].sizes[0] ?? null,
        },
        {
          productId: selectedProducts[1].id,
          title: selectedProducts[1].title,
          image: selectedProducts[1].image,
          price: selectedProducts[1].price,
          quantity: 2,
          size: null,
        },
      ],
      status: "delivered",
      total: selectedProducts[0].price + selectedProducts[1].price * 2,
      createdAt: "2026-03-15T10:30:00Z",
      updatedAt: "2026-03-20T14:00:00Z",
      pickupLocation: "UNILAG Sports Complex",
    },
    {
      id: `ord-${userId}-002`,
      userId,
      items: [
        {
          productId: selectedProducts[2].id,
          title: selectedProducts[2].title,
          image: selectedProducts[2].image,
          price: selectedProducts[2].price,
          quantity: 1,
          size: selectedProducts[2].sizes[0] ?? null,
        },
      ],
      status: pickRandom(statuses.slice(0, 2)),
      total: selectedProducts[2].price,
      createdAt: "2026-04-02T09:15:00Z",
      updatedAt: "2026-04-02T09:15:00Z",
    },
    {
      id: `ord-${userId}-003`,
      userId,
      items: [
        {
          productId: selectedProducts[3].id,
          title: selectedProducts[3].title,
          image: selectedProducts[3].image,
          price: selectedProducts[3].price,
          quantity: 1,
          size: selectedProducts[3].sizes[1] ?? null,
        },
        {
          productId: selectedProducts[4].id,
          title: selectedProducts[4].title,
          image: selectedProducts[4].image,
          price: selectedProducts[4].price,
          quantity: 3,
          size: null,
        },
      ],
      status: pickRandom(["processing", "ready_for_pickup"]),
      total: selectedProducts[3].price + selectedProducts[4].price * 3,
      createdAt: "2026-06-10T16:45:00Z",
      updatedAt: "2026-06-11T08:20:00Z",
      pickupLocation: "Main Campus Gate",
    },
  ];
}

const MOCK_ORDERS_KEY = "unisport-orders";

export function getMockOrders(userId: string): Order[] {
  try {
    const raw = localStorage.getItem(MOCK_ORDERS_KEY);
    if (raw) {
      const all: Order[] = JSON.parse(raw);
      const userOrders = all.filter((o) => o.userId === userId);
      if (userOrders.length > 0) return userOrders;
    }
  } catch {
    // ignore
  }
  const generated = generateMockOrders(userId);
  saveMockOrders(userId, generated);
  return generated;
}

export function saveMockOrders(userId: string, orders: Order[]) {
  try {
    const raw = localStorage.getItem(MOCK_ORDERS_KEY);
    const all: Order[] = raw ? JSON.parse(raw) : [];
    const others = all.filter((o) => o.userId !== userId);
    localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify([...others, ...orders]));
  } catch {
    // ignore
  }
}
