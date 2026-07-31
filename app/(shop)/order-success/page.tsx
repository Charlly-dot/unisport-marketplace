import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Placed | UniSport Marketplace",
};

export default function OrderSuccessPage() {
  return (
    <Container className="py-16">
      <Card className="mx-auto max-w-md space-y-6 p-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 size={40} className="text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Order Placed!</h1>
          <p className="text-sm text-slate-400">Your order has been confirmed. Check your email for details.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Button href="/orders" variant="secondary">View orders</Button>
          <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
            <ShoppingBag size={16} /> Continue shopping
          </Link>
        </div>
      </Card>
    </Container>
  );
}
