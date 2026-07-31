"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { WishlistItem } from "@/types/product";

const STORAGE_KEY = "unisport-wishlist";

function readFromStorage(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: WishlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let wishlistListeners: Array<() => void> = [];
let cachedItems: WishlistItem[] = [];
let hasHydrated = false;

function emitWishlistChange() {
  cachedItems = readFromStorage();
  wishlistListeners.forEach((l) => l());
}

function getWishlistSnapshot(): WishlistItem[] {
  if (typeof window === "undefined") return cachedItems;
  if (!hasHydrated) {
    hasHydrated = true;
    cachedItems = readFromStorage();
  }
  return cachedItems;
}

function getServerSnapshot(): WishlistItem[] {
  return cachedItems;
}

function subscribeWishlist(callback: () => void) {
  wishlistListeners = [...wishlistListeners, callback];
  return () => {
    wishlistListeners = wishlistListeners.filter((l) => l !== callback);
  };
}

export function useWishlist() {
  const items = useSyncExternalStore(subscribeWishlist, getWishlistSnapshot, getServerSnapshot);

  const toggleWishlist = useCallback((productId: string) => {
    const current = readFromStorage();
    const exists = current.some((item) => item.productId === productId);
    const next = exists
      ? current.filter((item) => item.productId !== productId)
      : [...current, { productId, addedAt: new Date().toISOString() }];
    writeToStorage(next);
    emitWishlistChange();
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  const count = useMemo(() => items.length, [items]);

  return { items, toggleWishlist, isWishlisted, count };
}
