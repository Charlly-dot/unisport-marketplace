"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SearchFiltersProps {
  query: string;
  onSearch: (value: string) => void;
  resultCount: number;
  onOpenFilters: () => void;
}

export default function SearchFilters({ query, onSearch, resultCount, onOpenFilters }: SearchFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          value={query}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search title, brand, sport..."
          className="pl-11"
          aria-label="Search products"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="hidden rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-sm text-slate-300 sm:flex">
          {resultCount} results
        </div>
        <Button variant="secondary" className="lg:hidden" onClick={onOpenFilters}>
          Filters
        </Button>
      </div>
    </div>
  );
}
