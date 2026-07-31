"use client";

import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
      aria-label={`Remove filter: ${label}`}
    >
      <span>{label}</span>
      <X size={12} className="text-slate-400" />
    </button>
  );
}

interface ActiveFiltersProps {
  query: string;
  selectedSports: string[];
  selectedBrands: string[];
  selectedConditions: string[];
  selectedSizes: string[];
  campusPickupOnly: boolean;
  maxPrice: number;
  absoluteMaxPrice: number;
  onRemoveQuery: () => void;
  onRemoveSport: (value: string) => void;
  onRemoveBrand: (value: string) => void;
  onRemoveCondition: (value: string) => void;
  onRemoveSize: (value: string) => void;
  onRemoveCampusPickup: () => void;
  onRemovePrice: () => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  query,
  selectedSports,
  selectedBrands,
  selectedConditions,
  selectedSizes,
  campusPickupOnly,
  maxPrice,
  absoluteMaxPrice,
  onRemoveQuery,
  onRemoveSport,
  onRemoveBrand,
  onRemoveCondition,
  onRemoveSize,
  onRemoveCampusPickup,
  onRemovePrice,
  onClearAll,
}: ActiveFiltersProps) {
  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (query) {
    chips.push({ key: "query", label: `"${query}"`, onRemove: onRemoveQuery });
  }
  selectedSports.forEach((sport) => {
    chips.push({ key: `sport-${sport}`, label: sport, onRemove: () => onRemoveSport(sport) });
  });
  selectedBrands.forEach((brand) => {
    chips.push({ key: `brand-${brand}`, label: brand, onRemove: () => onRemoveBrand(brand) });
  });
  selectedConditions.forEach((condition) => {
    chips.push({ key: `condition-${condition}`, label: condition, onRemove: () => onRemoveCondition(condition) });
  });
  selectedSizes.forEach((size) => {
    chips.push({ key: `size-${size}`, label: `Size ${size}`, onRemove: () => onRemoveSize(size) });
  });
  if (campusPickupOnly) {
    chips.push({ key: "campus", label: "Campus pickup", onRemove: onRemoveCampusPickup });
  }
  if (maxPrice < absoluteMaxPrice) {
    const formatted = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(maxPrice);
    chips.push({ key: "price", label: `Under ${formatted}`, onRemove: onRemovePrice });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-sky-400 underline-offset-2 transition hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
