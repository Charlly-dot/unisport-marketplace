"use client";

import type { SortOption } from "@/lib/products";

interface SortDropdownProps {
  sortBy: SortOption;
  onChange: (value: SortOption) => void;
}

const options: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "priceLow", label: "Price: Low → High" },
  { value: "priceHigh", label: "Price: High → Low" },
  { value: "highestRated", label: "Highest Rated" },
  { value: "mostPopular", label: "Most Popular" },
  { value: "alphabetical", label: "Alphabetical" },
];

export default function SortDropdown({ sortBy, onChange }: SortDropdownProps) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-300">
      <span className="whitespace-nowrap">Sort by</span>
      <select
        value={sortBy}
        onChange={(event) => onChange(event.target.value as SortOption)}
        className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-950 text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
