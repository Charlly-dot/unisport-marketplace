import { isApprovedEmail } from "@/lib/auth/config";
import { createUser } from "@/services/store/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const campus = String(body.campus ?? "").trim();
    const faculty = String(body.faculty ?? "").trim();
    const department = String(body.department ?? "").trim();
    const level = String(body.level ?? "").trim();

    if (!firstName || !lastName || !email || !password || !campus || !faculty || !department || !level) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
    if (!isApprovedEmail(email)) {
      return Response.json({ error: "Please use a valid university email (.edu or .edu.ng)." }, { status: 400 });
    }

    const user = await createUser({ firstName, lastName, email, password, campus, faculty, department, level });
    return Response.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_EXISTS") {
      return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    return Response.json({ error: "Registration failed." }, { status: 500 });
  }
}
