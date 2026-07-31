import Link from "next/link";
import { Container } from "@/components/ui/Container";

const footerLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Sell Gear", href: "/sell" },
  { label: "Campus Pickup", href: "/pickup" },
  { label: "Orders", href: "/orders" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/95 py-12 text-slate-400">
      <Container className="grid gap-10 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
            UniSport
          </Link>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Built for campus athletes and student sport fans. Discover premium sportswear, tech, and secondhand gear with easy pickup and delivery.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600">© 2026 UniSport Marketplace</p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-300">Explore</h3>
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-slate-400 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-300">Contact</h3>
            <p className="text-sm text-slate-400">support@unisport.com</p>
            <p className="text-sm text-slate-400">+1 (800) 555-8723</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
