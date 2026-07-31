"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ProductFilters } from "@/lib/products";

interface FilterSidebarProps {
  open: boolean;
  filters: ProductFilters;
  sports: string[];
  brands: string[];
  priceRange: readonly [number, number];
  onToggleSport: (value: string) => void;
  onToggleBrand: (value: string) => void;
  onToggleCondition: (value: string) => void;
  onToggleSize: (value: string) => void;
  onMaxPriceChange: (value: number) => void;
  onCampusPickupChange: (value: boolean) => void;
  onReset: () => void;
  onClose: () => void;
}

const conditions = ["New", "Gently Used"];
const sizes = ["XS", "S", "M", "L", "XL"];

function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-sm transition hover:border-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-400 focus:ring-sky-500"
      />
      <span className="text-slate-200">{label}</span>
    </label>
  );
}

function buildSidebarContent(props: Omit<FilterSidebarProps, "open">) {
  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Filters</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Refine results</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={props.onClose} className="lg:hidden">
            <X size={18} />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Sport</p>
            <div className="grid gap-2">
              {props.sports.map((sport) => (
                <CheckboxOption
                  key={sport}
                  label={sport}
                  checked={props.filters.selectedSports.includes(sport)}
                  onChange={() => props.onToggleSport(sport)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Condition</p>
            <div className="grid gap-2">
              {conditions.map((condition) => (
                <CheckboxOption
                  key={condition}
                  label={condition}
                  checked={props.filters.selectedConditions.includes(condition)}
                  onChange={() => props.onToggleCondition(condition)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Size</p>
            <div className="grid gap-2 md:grid-cols-2">
              {sizes.map((size) => (
                <CheckboxOption
                  key={size}
                  label={size}
                  checked={props.filters.selectedSizes.includes(size)}
                  onChange={() => props.onToggleSize(size)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Price</p>
                <p className="text-sm text-slate-500">
                  Up to ₦{props.filters.maxPrice.toLocaleString()}
                </p>
              </div>
            </div>
            <input
              type="range"
              min={props.priceRange[0]}
              max={props.priceRange[1]}
              value={props.filters.maxPrice}
              onChange={(event) => props.onMaxPriceChange(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-sky-400"
              aria-label="Maximum price"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Brand</p>
            <div className="grid gap-2">
              {props.brands.map((brand) => (
                <CheckboxOption
                  key={brand}
                  label={brand}
                  checked={props.filters.selectedBrands.includes(brand)}
                  onChange={() => props.onToggleBrand(brand)}
                />
              ))}
            </div>
          </div>
        </div>

        <Button variant="secondary" onClick={props.onReset} className="w-full">
          Reset filters
        </Button>
      </div>
    </div>
  );
}

export default function FilterSidebar({
  open,
  onClose,
  ...props
}: FilterSidebarProps) {
  return (
    <>
      <aside className="hidden lg:block sticky top-24 self-start">{buildSidebarContent({ ...props, onClose })}</aside>

      <div
        className={
          "fixed inset-y-0 left-0 z-50 w-full max-w-xs overflow-y-auto border-r border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40 transition duration-300 lg:hidden " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        {buildSidebarContent({ ...props, onClose })}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}
