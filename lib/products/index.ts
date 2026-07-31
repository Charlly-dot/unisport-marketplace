import productsData from "@/data/products.json";
import type { Product } from "@/types/product";

export const products: Product[] = productsData as Product[];

export type SortOption =
  | "newest"
  | "priceLow"
  | "priceHigh"
  | "highestRated"
  | "mostPopular"
  | "alphabetical";

export interface ProductFilters {
  query: string;
  selectedSports: string[];
  selectedBrands: string[];
  selectedConditions: string[];
  selectedSizes: string[];
  maxPrice: number;
  campusPickupOnly: boolean;
  sortBy: SortOption;
}

export function getFeaturedProducts() {
  return products.filter((item) => item.featured).slice(0, 6);
}

export function getTrendingProducts() {
  return products.filter((item) => item.trending).slice(0, 6);
}

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getUniqueBrands(items: Product[]) {
  return Array.from(new Set(items.map((product) => product.brand))).sort();
}

export function getUniqueSports(items: Product[]) {
  return Array.from(new Set(items.map((product) => product.sport))).sort();
}

export function getPriceRange(items: Product[]) {
  if (!items.length) {
    return [0, 0] as const;
  }

  const prices = items.map((product) => product.price);
  return [Math.min(...prices), Math.max(...prices)] as const;
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function searchProducts(items: Product[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((product) => {
    const searchable = [
      product.title,
      product.brand,
      product.sport,
      product.category,
      product.description,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

export function filterProducts(items: Product[], filters: ProductFilters) {
  return items.filter((product) => {
    const matchesSports =
      !filters.selectedSports.length ||
      filters.selectedSports.includes(product.sport);

    const matchesBrands =
      !filters.selectedBrands.length ||
      filters.selectedBrands.includes(product.brand);

    const matchesConditions =
      !filters.selectedConditions.length ||
      filters.selectedConditions.includes(product.condition);

    const matchesSizes =
      !filters.selectedSizes.length ||
      filters.selectedSizes.some((size) => product.sizes.includes(size));

    const matchesPrice = product.price <= filters.maxPrice;
    const matchesCampusPickup =
      !filters.campusPickupOnly || product.campusPickup;

    const queryMatched = searchProducts([product], filters.query).length > 0;

    return (
      matchesSports &&
      matchesBrands &&
      matchesConditions &&
      matchesSizes &&
      matchesPrice &&
      matchesCampusPickup &&
      queryMatched
    );
  });
}

export function sortProducts(items: Product[], sortBy: SortOption) {
  const sorted = [...items];

  switch (sortBy) {
    case "priceLow":
      return sorted.sort((a, b) => a.price - b.price);
    case "priceHigh":
      return sorted.sort((a, b) => b.price - a.price);
    case "highestRated":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "mostPopular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
    default:
      return sorted;
  }
}

export function getRelatedProducts(product: Product, items: Product[], count = 4) {
  return items
    .filter((item) => item.id !== product.id)
    .sort((a, b) => {
      const scoreA = Number(a.brand === product.brand) + Number(a.sport === product.sport);
      const scoreB = Number(b.brand === product.brand) + Number(b.sport === product.sport);
      return scoreB - scoreA;
    })
    .slice(0, count);
}
