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
    <footer className="border-t border-[#202024]/15 bg-[#202024] py-12 text-[#f6f4ee]/65">
      <Container className="grid gap-10 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-black tracking-[-0.07em] text-white">
            UNISPORT<span className="text-[#d8ff35]">•</span>
          </Link>
          <p className="max-w-xl text-sm leading-6 text-[#f6f4ee]/65">
            Built for campus athletes and student sport fans. Discover premium sportswear, tech, and secondhand gear with easy pickup and delivery.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-[#f6f4ee]/35">© 2026 UniSport Marketplace</p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d8ff35]">Explore</h3>
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-[#f6f4ee]/65 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d8ff35]">Contact</h3>
            <p className="text-sm text-[#f6f4ee]/65">support@unisport.com</p>
            <p className="text-sm text-[#f6f4ee]/65">+1 (800) 555-8723</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
