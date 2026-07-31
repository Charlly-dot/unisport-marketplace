"use client";

import { lazy, Suspense } from "react";
import type { Product } from "@/types/product";
import { getRelatedProducts } from "@/lib/products";
import { products } from "@/lib/products";

const ProductCard = lazy(() => import("@/components/shop/ProductCard"));

interface RelatedProductsProps {
  currentProduct: Product;
}

function RelatedGrid({ currentProduct }: RelatedProductsProps) {
  const related = getRelatedProducts(currentProduct, products, 6);

  if (related.length === 0) return null;

  return (
    <section className="space-y-6" aria-label="Related products">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
          You may also like
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Related Products
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function RelatedSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/80 p-5 shadow-xl"
        >
          <div className="mb-4 h-64 rounded-[1.75rem] bg-slate-800" />
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded-full bg-slate-800" />
            <div className="h-4 w-1/2 rounded-full bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  return (
    <Suspense fallback={<RelatedSkeleton />}>
      <RelatedGrid currentProduct={currentProduct} />
    </Suspense>
  );
}
