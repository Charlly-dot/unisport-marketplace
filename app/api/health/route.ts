import { getPaymentProvider } from "@/services/payments";

export async function GET() {
  const provider = getPaymentProvider();
  return Response.json({
    status: "ok",
    paymentProvider: provider.name,
    timestamp: new Date().toISOString(),
  });
}
