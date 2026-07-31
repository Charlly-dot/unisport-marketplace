import { getOrderById } from "@/services/store/orders";

export async function GET(_request: Request, ctx: RouteContext<"/api/orders/[id]">) {
  const { id } = await ctx.params;
  const order = await getOrderById(id);
  if (!order) return Response.json({ error: "Order not found." }, { status: 404 });
  return Response.json({ order });
}
