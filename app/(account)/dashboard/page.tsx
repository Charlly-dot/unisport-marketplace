"use client";

import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import AuthGuard from "@/components/auth/AuthGuard";
import { BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

function DashboardContent() {
  return (
    <Container className="py-10 lg:py-14">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Seller dashboard</h1>
        </div>

        <Card className="space-y-6 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
            <BarChart3 size={28} />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Dashboard is under development</h2>
            <p className="mx-auto max-w-md text-sm leading-6 text-slate-400">
              Track your sales, views, and earnings all in one place. This feature is coming soon.
            </p>
          </div>
          <Link
            href="/sell"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Go to Sell page <ArrowRight size={16} />
          </Link>
        </Card>
      </div>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
