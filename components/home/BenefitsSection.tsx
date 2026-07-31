import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

const benefits = [
  { title: "Campus pickup available", description: "Choose pickup locations near your university for same-day collection." },
  { title: "Student verified sellers", description: "Browse trusted listings approved for campus communities." },
  { title: "Flexible payment", description: "Pay online or at pickup with seamless checkout." },
];

export default function BenefitsSection() {
  return (
    <section className="space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Why UniSport</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Premium gear made for student athletes.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}