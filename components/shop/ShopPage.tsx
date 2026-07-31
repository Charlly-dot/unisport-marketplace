"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types/product";
import { ProductFilters, SortOption } from "@/lib/products";
import { useShopFilters } from "@/hooks/useShopFilters";
import SearchFilters from "./SearchFilters";
import SortDropdown from "./SortDropdown";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import ActiveFilters from "./ActiveFilters";
import { LoadingSkeleton, NoResultsState, ErrorState } from "./ShopStates";
import { motion } from "framer-motion";

interface ShopPageProps {
  products: Product[];
}

export default function ShopPage({ products }: ShopPageProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { filters, filteredProducts, brands, sports, priceRange, isPending, updateFilters, resetFilters } =
    useShopFilters(products);

  const handleToggleMulti = (
    key: keyof Omit<ProductFilters, "query" | "maxPrice" | "campusPickupOnly" | "sortBy">,
    value: string,
  ) => {
    updateFilters((current) => {
      const currentValue = current[key] as string[];
      const nextValue = currentValue.includes(value)
        ? currentValue.filter((item) => item !== value)
        : [...currentValue, value];

      return { [key]: nextValue } as Partial<ProductFilters>;
    });
  };

  const handleSortChange = (sortBy: SortOption) => {
    updateFilters({ sortBy });
  };

  const handleMaxPrice = (value: number) => {
    updateFilters({ maxPrice: value });
  };

  if (!products.length) {
    return <ErrorState />;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-slate-950 text-slate-100"
    >
      <Container className="py-10 lg:py-14">
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Shop</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Campus gear for every sport.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-400">
                Discover premium equipment, sneakers, and performance apparel with fast search, curated filters,
                and a modern campus shopping experience.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" className="lg:hidden" onClick={() => setIsMobileOpen(true)}>
                Filters
              </Button>
              <SortDropdown sortBy={filters.sortBy} onChange={handleSortChange} />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
            <SearchFilters
              query={filters.query}
              onSearch={(value) => updateFilters({ query: value })}
              resultCount={filteredProducts.length}
              onOpenFilters={() => setIsMobileOpen(true)}
            />
            <div className="hidden xl:flex items-center justify-end rounded-3xl border border-slate-800/80 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
              {filteredProducts.length} items matched
            </div>
          </div>

          <ActiveFilters
            query={filters.query}
            selectedSports={filters.selectedSports}
            selectedBrands={filters.selectedBrands}
            selectedConditions={filters.selectedConditions}
            selectedSizes={filters.selectedSizes}
            campusPickupOnly={filters.campusPickupOnly}
            maxPrice={filters.maxPrice}
            absoluteMaxPrice={priceRange[1]}
            onRemoveQuery={() => updateFilters({ query: "" })}
            onRemoveSport={(v) => handleToggleMulti("selectedSports", v)}
            onRemoveBrand={(v) => handleToggleMulti("selectedBrands", v)}
            onRemoveCondition={(v) => handleToggleMulti("selectedConditions", v)}
            onRemoveSize={(v) => handleToggleMulti("selectedSizes", v)}
            onRemoveCampusPickup={() => updateFilters({ campusPickupOnly: false })}
            onRemovePrice={() => updateFilters({ maxPrice: priceRange[1] })}
            onClearAll={resetFilters}
          />
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            open={isMobileOpen}
            onClose={() => setIsMobileOpen(false)}
            filters={filters}
            sports={sports}
            brands={brands}
            priceRange={priceRange}
            onToggleSport={(value) => handleToggleMulti("selectedSports", value)}
            onToggleBrand={(value) => handleToggleMulti("selectedBrands", value)}
            onToggleCondition={(value) => handleToggleMulti("selectedConditions", value)}
            onToggleSize={(value) => handleToggleMulti("selectedSizes", value)}
            onMaxPriceChange={handleMaxPrice}
            onCampusPickupChange={(value) => updateFilters({ campusPickupOnly: value })}
            onReset={resetFilters}
          />

          <main className="space-y-6">
            {isPending ? (
              <LoadingSkeleton count={8} />
            ) : filteredProducts.length ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <NoResultsState onReset={resetFilters} />
            )}
          </main>
        </div>
      </Container>
    </motion.section>
  );
}
