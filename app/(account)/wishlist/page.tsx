"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/context/CartContext";
import { getAllProducts, formatPrice } from "@/lib/products";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const allProducts = getAllProducts();
  const wishlistProducts = items
    .map((item) => allProducts.find((p) => p.id === item.productId))
    .filter(Boolean);

  const handleMoveToCart = (productId: string) => {
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;
    const defaultSize = product.sizes.length > 0 ? product.sizes[0] : null;
    addToCart(product, defaultSize);
    toggleWishlist(productId);
    toast.success("Moved to cart");
  };

  const handleRemove = (productId: string) => {
    toggleWishlist(productId);
    toast.success("Removed from wishlist");
  };

  return (
    <Container className="py-10 lg:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Wishlist</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Saved items</h1>
        </div>

        {wishlistProducts.length === 0 ? (
          <Card className="space-y-4 p-10 text-center">
            <Heart size={40} className="mx-auto text-slate-600" />
            <h2 className="text-xl font-semibold text-white">Your wishlist is empty</h2>
            <p className="text-sm text-slate-400">Browse the shop and save items you love.</p>
            <Button href="/shop" variant="secondary">Browse shop</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {wishlistProducts.map((product) => {
              if (!product) return null;
              return (
                <Card key={product.id} className="flex items-center gap-5 p-4">
                  <Link href={`/product/${product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                    <Image src={product.image} alt={product.title} fill className="object-cover" sizes="96px" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-white hover:text-sky-400 transition-colors truncate">{product.title}</h3>
                    </Link>
                    <p className="text-xs text-slate-500">{product.brand} · {product.sport}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleMoveToCart(product.id)} className="inline-flex items-center gap-1.5">
                      <ShoppingCart size={14} /> Add to cart
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleRemove(product.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-rose-500/50 hover:text-rose-400"
                      aria-label={`Remove ${product.title} from wishlist`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}
