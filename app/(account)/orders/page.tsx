"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { getMockOrders } from "@/lib/orders/mock";
import { formatPrice } from "@/lib/products";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type Order } from "@/types/user";
import AuthGuard from "@/components/auth/AuthGuard";
import { Package, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";

const STATUS_ICONS: Record<string, React.ElementType> = {
  processing: Clock,
  ready_for_pickup: MapPin,
  delivered: CheckCircle,
  cancelled: XCircle,
};

function OrdersContent() {
  const { currentUser } = useAuth();
  const orders = useMemo<Order[]>(
    () => (currentUser ? getMockOrders(currentUser.id) : []),
    [currentUser],
  );

  return (
    <Container className="py-10 lg:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Orders</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Order history</h1>
        </div>

        {orders.length === 0 ? (
          <Card className="space-y-4 p-10 text-center">
            <Package size={40} className="mx-auto text-slate-600" />
            <h2 className="text-xl font-semibold text-white">No orders yet</h2>
            <p className="text-sm text-slate-400">Your completed orders will appear here.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = STATUS_ICONS[order.status] ?? Clock;
              const created = new Date(order.createdAt).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <Card key={order.id} className="space-y-5 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-400">Order {order.id}</p>
                      <p className="text-xs text-slate-500">{created}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon size={14} className={ORDER_STATUS_COLORS[order.status]} />
                      <Badge variant={order.status === "cancelled" ? "warning" : "success"}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{item.title}</p>
                          <p className="text-xs text-slate-400">
                            Qty: {item.quantity}{item.size ? ` · Size ${item.size}` : ""}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-white">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  {order.pickupLocation && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin size={12} />
                      Pickup: {order.pickupLocation}
                    </div>
                  )}

                  <div className="border-t border-slate-800 pt-4 text-right">
                    <p className="text-sm text-slate-400">Total</p>
                    <p className="text-lg font-semibold text-white">{formatPrice(order.total)}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}
