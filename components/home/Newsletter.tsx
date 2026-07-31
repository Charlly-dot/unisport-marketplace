import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Newsletter() {
  return (
    <section className="rounded-[2rem] border border-slate-800/80 bg-slate-900/70 px-6 py-10 backdrop-blur-xl sm:px-10 sm:py-14">
      <div className="mx-auto max-w-5xl space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Stay in the loop</p>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Get exclusive restock alerts and campus deals.</h2>
        <p className="max-w-2xl mx-auto text-sm leading-6 text-slate-400">
          Sign up for email updates when new drops land, used gear goes live, and offers hit your campus.
        </p>
        <div className="grid gap-4 rounded-[1.75rem] border border-slate-800/90 bg-slate-950/80 p-5 sm:grid-cols-[1.8fr_1fr]">
          <Input placeholder="Your university email" type="email" aria-label="Newsletter email" />
          <Button className="w-full">Subscribe</Button>
        </div>
      </div>
    </section>
  );
}