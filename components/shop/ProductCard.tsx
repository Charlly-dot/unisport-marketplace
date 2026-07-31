"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import type { Product } from "@/types/product";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

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

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(product.id);
      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
    },
    [product.id, wishlisted, toggleWishlist]
  );

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="group overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950/90 shadow-xl shadow-slate-950/20"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative h-72 overflow-hidden bg-slate-900">
          <Image
            src={product.image}
            alt={product.title ?? "Product image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-800 bg-slate-900/90 text-slate-200 transition hover:border-slate-600 hover:text-white"
          >
            <Heart
              className={`h-5 w-5 ${wishlisted ? "fill-rose-400 text-rose-400" : ""}`}
            />
          </button>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{product.brand}</span>
          <span className="text-sm font-semibold text-white">{formatPrice(product.price)}</span>
        </div>

        <div className="space-y-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-lg font-semibold text-white line-clamp-2 hover:text-sky-400 transition-colors">{product.title}</h3>
          </Link>
          <p className="text-sm leading-6 text-slate-400 line-clamp-3">{product.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{product.sport}</Badge>
          <Badge variant={product.condition === "New" ? "success" : "warning"}>{product.condition}</Badge>
          {product.campusPickup && <Badge variant="default">Campus pickup</Badge>}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-300">
            <span className="font-semibold text-white">{product.rating.toFixed(1)} ★</span>
            <span className="ml-2">{product.reviewCount} reviews</span>
          </div>
          <Button variant="secondary" size="sm" disabled={product.stock === 0} onClick={handleAddToCart}>
            {product.stock > 0 ? "Add to cart" : "Sold out"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
