"use client";

import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  Shield,
  Star,
  Truck,
  ShoppingBag,
  Zap,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/products";
import { getReviewsByProductId, getSellerByName } from "@/lib/reviews";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";

import ImageGallery from "./ImageGallery";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";
import ReviewCard from "@/components/reviews/ReviewCard";
import SellerCard from "@/components/seller/SellerCard";

const RelatedProducts = lazy(() => import("./RelatedProducts"));

interface ProductPageClientProps {
  product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length > 0 ? null : null
  );
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const reviews = useMemo(() => getReviewsByProductId(product.id), [product.id]);
  const seller = useMemo(() => getSellerByName(product.seller), [product.seller]);

  const images = useMemo(() => {
    const base = [product.image];
    if (product.images) base.push(...product.images);
    return base;
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success("Added to cart");
  }, [product, selectedSize, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success("Added to cart");
  }, [product, selectedSize, quantity, addToCart]);

  const handleWishlist = useCallback(() => {
    toggleWishlist(product.id);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  }, [product.id, wishlisted, toggleWishlist]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  }, [product.title]);

  const stockStatus = useMemo(() => {
    if (product.stock === 0)
      return { label: "Out of stock", color: "text-rose-400" as const };
    if (product.stock <= 5)
      return {
        label: `Only ${product.stock} left`,
        color: "text-amber-400" as const,
      };
    return { label: "In stock", color: "text-emerald-400" as const };
  }, [product.stock]);

  return (
    <section className="bg-slate-950 py-8 lg:py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/shop" className="transition hover:text-slate-300">
              Shop
            </Link>
            <ChevronRight size={14} />
            <span className="text-slate-300">{product.category}</span>
            <ChevronRight size={14} />
            <span className="truncate text-sky-400">{product.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <ImageGallery images={images} alt={product.title} />

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{product.sport}</Badge>
                  <Badge
                    variant={
                      product.condition === "New" ? "success" : "warning"
                    }
                  >
                    {product.condition}
                  </Badge>
                  {product.campusPickup && (
                    <Badge variant="default">Campus Pickup</Badge>
                  )}
                </div>

                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  {product.brand}
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {product.title}
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-700 text-slate-700"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-500">
                      ({product.reviewCount})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-white">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${stockStatus.color === "text-rose-400" ? "bg-rose-400" : stockStatus.color === "text-amber-400" ? "bg-amber-400" : "bg-emerald-400"}`} />
                <span className={`text-sm font-medium ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>

              <div className="h-px bg-slate-800" />

              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
                disabled={product.stock === 0}
              />

              <QuantitySelector
                quantity={quantity}
                max={product.stock}
                onChange={setQuantity}
                disabled={product.stock === 0}
              />

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Zap size={18} />
                  Buy Now
                </motion.button>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={handleWishlist}
                  className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition ${
                    wishlisted
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                      : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  <Heart
                    size={16}
                    className={wishlisted ? "fill-rose-400" : ""}
                  />
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                >
                  <Share2 size={16} />
                  Share
                </motion.button>
              </div>

              <div className="h-px bg-slate-800" />

              <p className="text-sm leading-7 text-slate-300">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                    Features
                  </p>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-400"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 flex-shrink-0 text-sky-400"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
                <div className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Shield size={16} className="text-sky-400" />
                  <span>Buyer Protection</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Truck size={16} className="text-sky-400" />
                  <span>Fast Delivery</span>
                </div>
                {product.campusPickup && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckCircle2 size={16} className="text-sky-400" />
                    <span>Campus Pickup</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-8">
              {reviews.length > 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
                      Reviews
                    </p>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-white">
                        Customer Reviews
                      </h2>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                        {reviews.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={
                              i < Math.round(product.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-700 text-slate-700"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-white">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-slate-500">
                        based on {product.reviewCount} reviews
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review, idx) => (
                      <ReviewCard key={review.id} review={review} index={idx} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {seller && <SellerCard seller={seller} />}
            </div>
          </div>

          <div className="mt-16">
            <Suspense
              fallback={
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
              }
            >
              <RelatedProducts currentProduct={product} />
            </Suspense>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
