import { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | UniSport Marketplace",
  description: "Sign in to your UniSport account.",
};

export default function LoginPage() {
  return (
    <Container className="py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
