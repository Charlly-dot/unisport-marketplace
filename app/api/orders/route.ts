import { listOrdersByUser, createOrder, type OrderItemInput } from "@/services/store/orders";
import { getProductBySlug } from "@/services/store/products";
import { findUserByEmail } from "@/services/store/users";

const SHIPPING_COSTS: Record<string, number> = {
  campus_pickup: 0,
  standard: 2500,
  express: 5000,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) return Response.json({ error: "Email query param required." }, { status: 400 });

  const user = await findUserByEmail(email);
  if (!user) return Response.json({ error: "User not found." }, { status: 404 });

  const orders = await listOrdersByUser(user.id);
  return Response.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "");
    const user = await findUserByEmail(email);
    if (!user) return Response.json({ error: "User not found." }, { status: 404 });

    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0) return Response.json({ error: "Order has no items." }, { status: 400 });

    const items: OrderItemInput[] = [];
    let itemsTotal = 0;
    for (const item of rawItems) {
      const product = await getProductBySlug(String(item.slug ?? ""));
      if (!product) return Response.json({ error: `Product not found: ${item.slug}` }, { status: 404 });
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const size = item.size ? String(item.size) : null;
      items.push({
        productId: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity,
        size,
      });
      itemsTotal += product.price * quantity;
    }

    const deliveryMethod = String(body.deliveryMethod ?? "campus_pickup");
    const shipping = SHIPPING_COSTS[deliveryMethod] ?? 0;
    const tax = Math.round(itemsTotal * 0.075);
    const discount = Math.max(0, Math.min(itemsTotal, Number(body.discount) || 0));
    const total = itemsTotal + shipping + tax - discount;

    const order = await createOrder({
      userId: user.id,
      items,
      total,
      deliveryMethod,
      pickupLocation: body.pickupLocation ? String(body.pickupLocation) : undefined,
      shippingAddress: body.shippingAddress ?? undefined,
      payment: body.payment ?? undefined,
    });

    return Response.json({ order }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create order." }, { status: 500 });
  }
}
