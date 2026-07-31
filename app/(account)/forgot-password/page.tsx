"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Container className="py-16">
      <Card className="mx-auto max-w-md space-y-6 p-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
            <Mail size={24} />
          </div>
          <h1 className="text-2xl font-semibold text-white">Reset your password</h1>
          <p className="text-sm text-slate-400">
            Enter your university email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              If an account exists with <strong>{email}</strong>, a reset link has been sent.
            </div>
            <Link href="/login" className="inline-block text-sm text-sky-400 hover:underline">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label htmlFor="reset-email" className="text-sm font-medium text-slate-300">Email</label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@university.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        )}

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </Card>
    </Container>
  );
}
