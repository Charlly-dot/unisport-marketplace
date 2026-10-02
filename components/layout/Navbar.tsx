"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import CartDrawer from "@/components/cart/CartDrawer";
import UserMenu from "@/components/layout/UserMenu";
import ThemeToggle from "@/components/layout/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/sell", label: "Sell" },
];

export default function Navbar() {
  const { itemCount, openDrawer } = useCart();
  useWishlist();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/shop");
    }
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#202024]/15 bg-[#f6f4ee]/95 text-[#202024] backdrop-blur-xl">
        <Container className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="text-lg font-black tracking-[-0.07em] text-[#202024]">
            UNISPORT<span className="text-[#ff684f]">•</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-[#202024]/70 transition hover:text-[#3757df]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <form
              onSubmit={handleSubmit}
              className={`items-center gap-2 overflow-hidden transition-all duration-300 ${
                searchOpen ? "flex w-64" : "flex w-auto"
              }`}
            >
              <button
                type={searchOpen ? "submit" : "button"}
                onClick={() => {
                  if (!searchOpen) setSearchOpen(true);
                }}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
                aria-label={searchOpen ? "Submit search" : "Open search"}
              >
                <Search size={18} />
              </button>
              {searchOpen && (
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search gear..."
                  className="h-11 w-full rounded-full border border-slate-700 bg-slate-900 px-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400"
                  onBlur={(e) => {
                    if (!e.target.value) setSearchOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchOpen(false);
                      setQuery("");
                    }
                  }}
                />
              )}
            </form>

            <Link
              href="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white md:hidden"
              aria-label="Open cart drawer"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            <ThemeToggle />
            <UserMenu />
          </div>

          <div className="block md:hidden">
            <Button size="sm">Menu</Button>
          </div>
        </Container>
      </header>
      <CartDrawer />
    </>
  );
}
