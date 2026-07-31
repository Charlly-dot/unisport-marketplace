import { getPaymentProvider } from "@/services/payments";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference = String(body.reference ?? "");
    if (!reference) return Response.json({ error: "Reference is required." }, { status: 400 });

    const provider = getPaymentProvider();
    const result = await provider.verify(reference);

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment verification failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
