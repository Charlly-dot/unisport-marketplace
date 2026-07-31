import { promises as fs } from "fs";
import path from "path";
import productsData from "@/data/products.json";
import type { Product } from "@/types/product";

const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

export async function getProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
    return JSON.parse(raw) as Product[];
  } catch {
    return productsData as Product[];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
