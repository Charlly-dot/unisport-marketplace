import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register | UniSport Marketplace",
  description: "Create your UniSport student account.",
};

export default function RegisterPage() {
  return (
    <Container className="py-16">
      <RegisterForm />
    </Container>
  );
}
