"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { isApprovedEmail, CAMPUSES, FACULTIES, LEVELS } from "@/lib/auth/config";
import toast from "react-hot-toast";

function getRegistrationErrors(data: { firstName: string; lastName: string; email: string; password: string; confirmPassword: string; campus: string; faculty: string; department: string; level: string; terms: boolean }) {
  const errors: string[] = [];

  if (!data.firstName.trim()) errors.push("First name is required.");
  if (!data.lastName.trim()) errors.push("Last name is required.");

  if (!data.email.trim()) {
    errors.push("Email is required.");
  } else if (!isApprovedEmail(data.email)) {
    errors.push("Please use a valid university email (.edu or .edu.ng).");
  }

  if (!data.password) {
    errors.push("Password is required.");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (data.password !== data.confirmPassword) {
    errors.push("Passwords do not match.");
  }

  if (!data.campus) errors.push("Please select your campus.");
  if (!data.faculty) errors.push("Please select your faculty.");
  if (!data.department.trim()) errors.push("Department is required.");
  if (!data.level) errors.push("Please select your academic level.");
  if (!data.terms) errors.push("You must accept the terms.");

  return errors;
}

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    campus: "",
    faculty: "",
    department: "",
    level: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const fieldErrors = getRegistrationErrors(form);
    if (fieldErrors.length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email.trim(),
      password: form.password,
      campus: form.campus,
      faculty: form.faculty,
      department: form.department,
      level: form.level,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Account created! Welcome to UniSport.");
      router.push("/");
    } else {
      setErrors([result.error || "Registration failed."]);
    }
  };

  return (
    <Card className="mx-auto max-w-lg space-y-6 p-8">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
          <UserPlus size={24} />
        </div>
        <h1 className="text-2xl font-semibold text-white">Create your account</h1>
        <p className="text-sm text-slate-400">Join the campus marketplace with your university email</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-slate-300">First Name</label>
            <Input id="firstName" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required autoComplete="given-name" />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-slate-300">Last Name</label>
            <Input id="lastName" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required autoComplete="family-name" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="reg-email" className="text-sm font-medium text-slate-300">University Email</label>
          <Input id="reg-email" type="email" placeholder="you@university.edu.ng" value={form.email} onChange={(e) => update("email", e.target.value)} required autoComplete="email" />
          {form.email && !isApprovedEmail(form.email) && (
            <p className="text-xs text-amber-400">Must be a valid .edu or .edu.ng address</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="reg-password" className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <Input id="reg-password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)} required className="pr-11" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">Confirm Password</label>
            <div className="relative">
              <Input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required className="pr-11" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" aria-label={showConfirm ? "Hide password" : "Show password"}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="campus" className="text-sm font-medium text-slate-300">Campus</label>
          <select id="campus" value={form.campus} onChange={(e) => update("campus", e.target.value)} className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20">
            <option value="">Select campus</option>
            {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="faculty" className="text-sm font-medium text-slate-300">Faculty</label>
            <select id="faculty" value={form.faculty} onChange={(e) => update("faculty", e.target.value)} className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20">
              <option value="">Select faculty</option>
              {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="level" className="text-sm font-medium text-slate-300">Level</label>
            <select id="level" value={form.level} onChange={(e) => update("level", e.target.value)} className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20">
              <option value="">Select level</option>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="department" className="text-sm font-medium text-slate-300">Department</label>
          <Input id="department" placeholder="e.g. Computer Science" value={form.department} onChange={(e) => update("department", e.target.value)} required />
        </div>

        <label className="flex items-start gap-3 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => update("terms", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-400 focus:ring-sky-500"
          />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>

        {errors.length > 0 && (
          <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300" role="alert">
            <ul className="list-inside list-disc space-y-1">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-sky-400 hover:underline">Sign in</Link>
      </p>
    </Card>
  );
}
