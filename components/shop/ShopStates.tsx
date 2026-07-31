"use client";

import { AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NoResultsStateProps {
  onReset: () => void;
}

export function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20">
          <div className="mb-4 h-64 rounded-[1.75rem] bg-slate-800" />
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded-full bg-slate-800" />
            <div className="h-4 w-1/2 rounded-full bg-slate-800" />
            <div className="grid gap-3">
              <div className="h-3 rounded-full bg-slate-800" />
              <div className="h-3 rounded-full bg-slate-800" />
              <div className="h-10 rounded-[1rem] bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function NoResultsState({ onReset }: NoResultsStateProps) {
  return (
    <section className="rounded-[2rem] border border-slate-800/80 bg-slate-900/80 p-10 text-center shadow-xl shadow-slate-950/20">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-slate-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-sky-400">
          <Sparkles size={28} />
        </div>
        <p className="text-sm uppercase tracking-[0.35em] text-sky-400">No matches</p>
        <h2 className="text-2xl font-semibold text-white">We could not find any products.</h2>
        <p className="max-w-sm text-sm leading-6 text-slate-400">
          Update your search or clear filters to rediscover campus-ready gear.
        </p>
        <Button variant="secondary" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </section>
  );
}

export function ErrorState() {
  return (
    <section className="rounded-[2rem] border border-rose-500/20 bg-slate-950/90 p-10 text-center text-slate-300 shadow-xl shadow-slate-950/30">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
          <AlertTriangle size={28} />
        </div>
        <p className="text-sm uppercase tracking-[0.35em] text-rose-400">Oops</p>
        <h2 className="text-2xl font-semibold text-white">There was a problem loading products.</h2>
        <p className="max-w-sm text-sm leading-6 text-slate-400">
          Please refresh the page or try again later.
        </p>
      </div>
    </section>
  );
}
