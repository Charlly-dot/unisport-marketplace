import { createHash } from "crypto";
import { authenticateUser } from "@/services/store/users";

function signToken(payload: string): string {
  const secret = process.env.AUTH_SECRET ?? "unisport-dev-secret";
  return createHash("sha256").update(payload + secret).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signToken(`${user.id}:${user.email}`);
    return Response.json({ user, token });
  } catch {
    return Response.json({ error: "Login failed." }, { status: 500 });
  }
}
