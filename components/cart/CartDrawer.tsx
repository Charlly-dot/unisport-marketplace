"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeDrawer,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totals,
    itemCount,
  } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-800/80 bg-slate-950/95 shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-sky-400" />
                <h2 className="text-lg font-semibold text-white">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="rounded-full bg-sky-400/15 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 transition hover:text-white"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-slate-600">
                    <ShoppingBag size={28} />
                  </div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                    Empty cart
                  </p>
                  <p className="text-sm text-slate-400">
                    Add items to get started.
                  </p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-3"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800">
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={closeDrawer}
                            className="text-sm font-semibold text-white line-clamp-1 hover:text-sky-400 transition-colors"
                          >
                            {item.product.title}
                          </Link>
                          {item.size && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              Size: {item.size}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-white">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center self-start rounded-full border border-slate-800 text-slate-500 transition hover:border-rose-500/30 hover:text-rose-400"
                        aria-label={`Remove ${item.product.title}`}
                      >
                        <X size={12} />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-4 border-t border-slate-800/80 px-6 py-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Shipping</span>
                    <span>
                      {totals.shipping === 0
                        ? "Free"
                        : formatPrice(totals.shipping)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Tax</span>
                    <span>{formatPrice(totals.tax)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex items-center justify-between text-sm text-emerald-400">
                      <span>Discount</span>
                      <span>-{formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-800" />
                  <div className="flex items-center justify-between text-base font-semibold text-white">
                    <span>Total</span>
                    <span>{formatPrice(totals.grandTotal)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  Checkout
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="w-full rounded-2xl border border-slate-800 bg-transparent py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
