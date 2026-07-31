"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Tag, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { Container } from "@/components/ui/Container";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totals,
    itemCount,
    couponApplied,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [campusPickup, setCampusPickup] = useState(false);

  const handleApplyCoupon = () => {
    applyCoupon(couponInput);
  };

  const pickupItems = useMemo(
    () => items.filter((i) => i.product.campusPickup),
    [items]
  );

  if (items.length === 0) {
    return (
      <section className="bg-slate-950 py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-md text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-slate-600 mb-6">
              <ShoppingBag size={36} />
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
              Empty cart
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Your cart is empty
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Start shopping to add items to your cart.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Browse Shop
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-slate-950 py-10 lg:py-14">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-3 mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
              Cart
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="text-sm text-slate-400">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Cart Items
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-slate-500 transition hover:text-rose-400"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 rounded-[1.5rem] border border-slate-800/80 bg-slate-900/60 p-4"
                  >
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="text-sm font-semibold text-white line-clamp-1 hover:text-sky-400 transition-colors"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.product.brand}
                            {item.size && ` · Size ${item.size}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800 text-slate-500 transition hover:border-rose-500/30 hover:text-rose-400"
                          aria-label={`Remove ${item.product.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            disabled={item.quantity >= item.product.stock}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="space-y-5 rounded-[1.5rem] border border-slate-800/80 bg-slate-900/60 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Shipping</span>
                    <span>
                      {totals.shipping === 0
                        ? "Free"
                        : formatPrice(totals.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Tax (7.5%)</span>
                    <span>{formatPrice(totals.tax)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-400">
                      <span>Discount</span>
                      <span>-{formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-800" />
                  <div className="flex justify-between text-base font-semibold text-white">
                    <span>Total</span>
                    <span>{formatPrice(totals.grandTotal)}</span>
                  </div>
                </div>

                {pickupItems.length > 0 && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-950/50 px-4 py-3 text-sm transition hover:border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={campusPickup}
                        onChange={(e) => setCampusPickup(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-400 focus:ring-sky-500"
                      />
                      <span className="text-slate-200">
                        Campus Pickup (free)
                      </span>
                    </label>
                    <p className="text-xs text-slate-500">
                      {pickupItems.length} {pickupItems.length === 1 ? "item" : "items"} eligible
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/90 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>
                    {couponApplied ? (
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                      >
                        Applied
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {!couponApplied && (
                    <p className="text-xs text-slate-600">
                      Try &quot;CAMPUS10&quot; for 10% off
                    </p>
                  )}
                </div>

                <Link
                  href="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
