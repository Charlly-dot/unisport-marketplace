import { getProducts } from "@/services/store/products";

export async function GET() {
  try {
    const products = await getProducts();
    return Response.json({ products });
  } catch {
    return Response.json({ error: "Failed to load products." }, { status: 500 });
  }
}
