"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { calculateDiscount, type Coupon } from "@/lib/checkout/coupons";
import { createOrder, initializePayment, verifyPayment } from "@/lib/orders/api";
import type { CheckoutStep, CheckoutState, CustomerDetails, DeliveryDetails, PaymentDetails } from "@/lib/checkout/types";
import { CHECKOUT_STEPS, SHIPPING_COSTS } from "@/lib/checkout/types";
import StepIndicator from "./StepIndicator";
import CustomerDetailsStep from "./CustomerDetailsStep";
import DeliveryStep from "./DeliveryStep";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";
import ConfirmationStep from "./ConfirmationStep";
import CouponInput from "./CouponInput";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<CheckoutStep>("details");
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);
  const verifiedRef = useRef(false);

  const [customer, setCustomer] = useState<CustomerDetails>({
    firstName: currentUser?.firstName ?? "",
    lastName: currentUser?.lastName ?? "",
    email: currentUser?.email ?? "",
    phone: "",
  });

  const [delivery, setDelivery] = useState<DeliveryDetails>({ method: "campus_pickup" });
  const [payment, setPayment] = useState<PaymentDetails>({ method: "credit_card" });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);
  const shipping = SHIPPING_COSTS[delivery.method];
  const tax = Math.round(subtotal * 0.075);
  const discountAmount = appliedCoupon ? calculateDiscount(appliedCoupon, subtotal, shipping) : 0;

  const currentIdx = CHECKOUT_STEPS.indexOf(step);

  const goNext = useCallback(() => {
    if (currentIdx < CHECKOUT_STEPS.length - 1) {
      setStep(CHECKOUT_STEPS[currentIdx + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIdx]);

  const goBack = useCallback(() => {
    if (currentIdx > 0) {
      setStep(CHECKOUT_STEPS[currentIdx - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIdx]);

  const submitOrder = useCallback(
    async (reference?: string, paid?: boolean) => {
      if (!currentUser) return;
      const order = await createOrder({
        email: customer.email,
        items: items.map((item) => ({
          slug: item.product.slug,
          quantity: item.quantity,
          size: item.size,
        })),
        deliveryMethod: delivery.method,
        pickupLocation: delivery.method === "campus_pickup" ? delivery.pickupLocation : undefined,
        shippingAddress: delivery,
        discount: discountAmount,
        payment: paid
          ? {
              method: payment.method,
              provider: "payment-gateway",
              reference: reference ?? "",
              paidAt: new Date().toISOString(),
            }
          : payment.method === "pay_on_pickup"
            ? { method: payment.method, provider: "on_pickup", reference: "pay-on-pickup", paidAt: new Date().toISOString() }
            : undefined,
      });

      setOrderId(order.id);
      clearCart();
      setStep("confirmation");
      toast.success("Order placed successfully!");
    },
    [currentUser, customer, items, delivery, payment, discountAmount, clearCart],
  );

  const handlePlaceOrder = useCallback(async () => {
    if (!currentUser || placing) return;
    setPlacing(true);

    const total = subtotal + shipping + tax - discountAmount;

    try {
      if (payment.method !== "pay_on_pickup") {
        const init = await initializePayment({
          email: customer.email,
          amount: total,
          metadata: { deliveryMethod: delivery.method, coupon: appliedCoupon?.code ?? "" },
        });

        if (init.redirectUrl) {
          window.location.href = init.redirectUrl;
          return;
        }

        await submitOrder(init.reference, true);
      } else {
        await submitOrder();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong while placing your order.";
      toast.error(message);
    } finally {
      setPlacing(false);
    }
  }, [currentUser, placing, subtotal, shipping, tax, discountAmount, payment, customer, delivery, appliedCoupon, submitOrder]);

  useEffect(() => {
    if (verifiedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("verify");
    if (!reference) return;
    verifiedRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const result = await verifyPayment(reference);
        if (cancelled) return;
        if (!result.success) throw new Error("Payment could not be verified.");
        await submitOrder(reference, true);
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Payment verification failed.";
          toast.error(message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [submitOrder]);

  const state: CheckoutState = { step, customer, delivery, payment, couponCode: appliedCoupon?.code ?? "", appliedCoupon, items };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <Container className="py-16">
        <Card className="mx-auto max-w-md space-y-4 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Empty cart</p>
          <h2 className="text-xl font-semibold text-white">Add items to checkout</h2>
          <Button href="/shop" variant="secondary">Browse shop</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-10 lg:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Checkout</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Secure checkout</h1>
        </div>

        <StepIndicator currentStep={step} />

        {step !== "confirmation" && (
          <CouponInput
            subtotal={subtotal}
            shippingCost={shipping}
            appliedCoupon={appliedCoupon}
            onApply={setAppliedCoupon}
            onRemove={() => setAppliedCoupon(null)}
          />
        )}

        <Card className="p-6 sm:p-8">
          {step === "details" && <CustomerDetailsStep data={customer} onChange={setCustomer} onNext={goNext} />}
          {step === "delivery" && <DeliveryStep data={delivery} onChange={setDelivery} onNext={goNext} onBack={goBack} />}
          {step === "payment" && <PaymentStep data={payment} onChange={setPayment} onNext={goNext} onBack={goBack} />}
          {step === "review" && <ReviewStep state={state} onBack={goBack} onPlaceOrder={handlePlaceOrder} placing={placing} />}
          {step === "confirmation" && <ConfirmationStep state={state} orderId={orderId} />}
        </Card>
      </div>
    </Container>
  );
}
