"use client";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import AuthGuard from "@/components/auth/AuthGuard";
import { Tag, ArrowRight } from "lucide-react";
import Link from "next/link";

function SellContent() {
  return (
    <Container className="py-10 lg:py-14">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Sell</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Sell your gear</h1>
        </div>

        <Card className="space-y-6 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
            <Tag size={28} />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Seller dashboard coming soon</h2>
            <p className="mx-auto max-w-md text-sm leading-6 text-slate-400">
              We&apos;re building a powerful seller experience where you can list products, track orders, manage inventory, and grow your campus brand.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
              Browse shop <ArrowRight size={16} />
            </Link>
            <Button variant="secondary" disabled>Join waitlist</Button>
          </div>
        </Card>

        <Card className="space-y-4 p-8">
          <h3 className="text-lg font-semibold text-white">What to expect</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" /> List unlimited products with photos</li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" /> Real-time order management</li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" /> Campus pickup scheduling</li>
            <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" /> Analytics dashboard</li>
          </ul>
        </Card>
      </div>
    </Container>
  );
}

export default function SellPage() {
  return (
    <AuthGuard>
      <SellContent />
    </AuthGuard>
  );
}
