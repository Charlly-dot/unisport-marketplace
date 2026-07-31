"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartItem, CartTotals, Product } from "@/types/product";

const SHIPPING_COST = 2500;
const PICKUP_COST = 0;
const TAX_RATE = 0.075;
const FREE_SHIPPING_THRESHOLD = 100000;
const COUPON_DISCOUNT = 0.1;

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  couponApplied: boolean;
  totals: CartTotals;
  itemCount: number;
  addToCart: (product: Product, size: string | null, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "unisport-cart";

function readFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let cartListeners: Array<() => void> = [];
let cachedItems: CartItem[] = [];
let hasHydrated = false;

function emitCartChange() {
  cachedItems = readFromStorage();
  cartListeners.forEach((l) => l());
}

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return cachedItems;
  if (!hasHydrated) {
    hasHydrated = true;
    cachedItems = readFromStorage();
  }
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return cachedItems;
}

function subscribeCart(callback: () => void) {
  cartListeners = [...cartListeners, callback];
  return () => {
    cartListeners = cartListeners.filter((l) => l !== callback);
  };
}

function computeTotals(
  items: CartItem[],
  couponApplied: boolean
): CartTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const hasShippedItems = items.some((item) => !item.product.campusPickup);
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || !hasShippedItems
      ? PICKUP_COST
      : SHIPPING_COST;

  const tax = Math.round(subtotal * TAX_RATE);
  const discount = couponApplied ? Math.round(subtotal * COUPON_DISCOUNT) : 0;
  const grandTotal = subtotal + shipping + tax - discount;

  return { subtotal, shipping, pickup: PICKUP_COST, tax, discount, grandTotal };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const addToCart = useCallback(
    (product: Product, size: string | null, quantity = 1) => {
      const current = readFromStorage();
      const existing = current.find(
        (item) => item.product.id === product.id && item.size === size
      );
      let next: CartItem[];
      if (existing) {
        next = current.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size ?? "none"}-${Date.now()}`,
          product,
          quantity: Math.min(quantity, product.stock),
          size,
        };
        next = [...current, newItem];
      }
      writeToStorage(next);
      emitCartChange();
      setIsOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((itemId: string) => {
    const next = readFromStorage().filter((item) => item.id !== itemId);
    writeToStorage(next);
    emitCartChange();
  }, []);

  const increaseQuantity = useCallback((itemId: string) => {
    const next = readFromStorage().map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.min(item.quantity + 1, item.product.stock) }
        : item
    );
    writeToStorage(next);
    emitCartChange();
  }, []);

  const decreaseQuantity = useCallback((itemId: string) => {
    const next = readFromStorage()
      .map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    writeToStorage(next);
    emitCartChange();
  }, []);

  const clearCart = useCallback(() => {
    writeToStorage([]);
    emitCartChange();
    setCouponApplied(false);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    if (code.toUpperCase() === "CAMPUS10") {
      setCouponApplied(true);
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponApplied(false);
  }, []);

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totals = useMemo(
    () => computeTotals(items, couponApplied),
    [items, couponApplied]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      couponApplied,
      totals,
      itemCount,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      openDrawer,
      closeDrawer,
    }),
    [
      items,
      isOpen,
      couponApplied,
      totals,
      itemCount,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      openDrawer,
      closeDrawer,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
