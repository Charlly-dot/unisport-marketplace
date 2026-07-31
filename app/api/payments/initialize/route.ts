import { getPaymentProvider, generatePaymentReference } from "@/services/payments";
import { findUserByEmail } from "@/services/store/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "");
    const amount = Number(body.amount);
    const metadata = body.metadata ?? {};

    if (!email) return Response.json({ error: "Email is required." }, { status: 400 });
    if (!amount || amount <= 0) return Response.json({ error: "Valid amount is required." }, { status: 400 });

    const user = await findUserByEmail(email);
    if (!user) return Response.json({ error: "User not found." }, { status: 404 });

    const reference = generatePaymentReference();
    const provider = getPaymentProvider();
    const result = await provider.initialize({ amount, email, reference, metadata });

    return Response.json({
      reference,
      provider: provider.name,
      redirectUrl: result.checkoutUrl,
      checkoutUrl: result.checkoutUrl,
      requiresRedirect: result.requiresRedirect,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment initialization failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
