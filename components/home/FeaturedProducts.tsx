"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addToCart } = useCart();

  return (
    <section className="space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Featured gear</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Campus favorites in stock</h2>
          </div>
          <Button href="/shop" variant="ghost">View all</Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <FeaturedCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
  product,
  addToCart,
}: {
  product: Product;
  addToCart: (product: Product, size: string | null) => void;
}) {
  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const defaultSize = product.sizes.length > 0 ? product.sizes[0] : null;
      addToCart(product, defaultSize);
      toast.success("Added to cart");
    },
    [product, addToCart]
  );

  return (
    <Card className="overflow-hidden p-0">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative h-72 w-full overflow-hidden bg-slate-900/80 transition duration-300 hover:scale-[1.01]">
          <Image
            src={product.image}
            alt={product.title ?? "Featured product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="success">{product.category}</Badge>
          <span className="text-sm font-semibold text-white">{formatPrice(product.price)}</span>
        </div>
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xl font-semibold text-white hover:text-sky-400 transition-colors">{product.title}</h3>
          </Link>
          <p className="mt-3 text-sm leading-6 text-slate-400 line-clamp-3">{product.description}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{product.rating.toFixed(1)} ★</span>
          <Button variant="secondary" size="sm" disabled={product.stock === 0} onClick={handleAddToCart}>
            {product.stock > 0 ? "Add to cart" : "Sold out"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
