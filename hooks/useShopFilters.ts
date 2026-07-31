"use client";

import { useState, useMemo, useCallback, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/types/product";
import {
  filterProducts,
  getPriceRange,
  getUniqueBrands,
  getUniqueSports,
  sortProducts,
  type ProductFilters,
  type SortOption,
} from "@/lib/products";

function readFiltersFromURL(searchParams: URLSearchParams, products: Product[]): ProductFilters {
  const [, maxPrice] = getPriceRange(products);
  const paramMax = searchParams.get("maxPrice");

  return {
    query: searchParams.get("q") ?? "",
    selectedSports: searchParams.get("sport")?.split(",").filter(Boolean) ?? [],
    selectedBrands: searchParams.get("brand")?.split(",").filter(Boolean) ?? [],
    selectedConditions: searchParams.get("condition")?.split(",").filter(Boolean) ?? [],
    selectedSizes: searchParams.get("size")?.split(",").filter(Boolean) ?? [],
    maxPrice: paramMax ? Number(paramMax) : maxPrice,
    campusPickupOnly: searchParams.get("pickup") === "1",
    sortBy: (searchParams.get("sort") as SortOption) ?? "newest",
  };
}

function buildQueryString(filters: ProductFilters, absoluteMax: number): string {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.selectedSports.length) params.set("sport", filters.selectedSports.join(","));
  if (filters.selectedBrands.length) params.set("brand", filters.selectedBrands.join(","));
  if (filters.selectedConditions.length) params.set("condition", filters.selectedConditions.join(","));
  if (filters.selectedSizes.length) params.set("size", filters.selectedSizes.join(","));
  if (filters.campusPickupOnly) params.set("pickup", "1");
  if (filters.sortBy !== "newest") params.set("sort", filters.sortBy);
  if (filters.maxPrice < absoluteMax) params.set("maxPrice", String(filters.maxPrice));

  return params.toString();
}

export function useShopFilters(products: Product[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const absoluteMaxPrice = useMemo(() => {
    const [, max] = getPriceRange(products);
    return max;
  }, [products]);

  const [filters, setFilters] = useState<ProductFilters>(() =>
    readFiltersFromURL(searchParams, products),
  );

  useEffect(() => {
    const qs = buildQueryString(filters, absoluteMaxPrice);
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }, [filters, absoluteMaxPrice, router]);

  const filteredProducts = useMemo(
    () => sortProducts(filterProducts(products, filters), filters.sortBy),
    [products, filters],
  );

  const brands = useMemo(() => getUniqueBrands(products), [products]);
  const sports = useMemo(() => getUniqueSports(products), [products]);
  const priceRange = useMemo(() => getPriceRange(products), [products]);

  const updateFilters = useCallback(
    (patch: Partial<ProductFilters> | ((current: ProductFilters) => Partial<ProductFilters>)) => {
      startTransition(() => {
        setFilters((current) => {
          const nextPatch = typeof patch === "function" ? patch(current) : patch;
          return { ...current, ...nextPatch };
        });
      });
    },
    [],
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      const [, max] = getPriceRange(products);
      setFilters({
        query: "",
        selectedSports: [],
        selectedBrands: [],
        selectedConditions: [],
        selectedSizes: [],
        maxPrice: max,
        campusPickupOnly: false,
        sortBy: "newest",
      });
    });
  }, [products]);

  return {
    filters,
    filteredProducts,
    brands,
    sports,
    priceRange,
    absoluteMaxPrice,
    isPending,
    updateFilters,
    resetFilters,
  };
}
