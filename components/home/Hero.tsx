import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-800/90 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_35%),_radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_30%),_linear-gradient(180deg,#0f172a_0%,#020617_100%)] px-6 py-16 sm:px-10 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <span className="inline-flex rounded-full bg-sky-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">
            Campus sports essentials
          </span>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The student sports marketplace built for campus athletes.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Shop official university apparel, performance footwear, fitness accessories, and pre-loved gear with fast campus pickup and delivery.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/shop">Shop now</Button>
            <Button href="/sell" variant="secondary" className="w-full sm:w-auto">
              Sell gear
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(56,189,248,0.18),_transparent_30%)]" />
          <div className="relative space-y-6">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5">
              <div className="relative h-72 overflow-hidden rounded-[1.75rem] bg-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80"
                  alt="Athletic sneakers on campus"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-3 text-slate-300">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Campus pickup & delivery</p>
              <h2 className="text-2xl font-semibold text-white">Gear up for game day</h2>
              <p className="max-w-xl text-sm leading-6 text-slate-400">
                From training kits to laid-back campus apparel, find high-quality sports gear from trusted sellers and official brands.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}