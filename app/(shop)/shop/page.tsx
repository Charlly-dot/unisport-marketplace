import { Suspense } from "react";
import { getAllProducts } from "@/lib/products";
import ShopPage from "@/components/shop/ShopPage";

export default function ShopRoute() {
  const products = getAllProducts();

  return (
    <Suspense>
      <ShopPage products={products} />
    </Suspense>
  );
}
