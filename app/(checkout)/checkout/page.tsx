import { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import CheckoutPage from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout | UniSport Marketplace",
  description: "Complete your purchase securely.",
};

export default function CheckoutRoute() {
  return (
    <AuthGuard>
      <CheckoutPage />
    </AuthGuard>
  );
}
