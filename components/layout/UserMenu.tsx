"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, ChevronDown, Heart, Package, Tag, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const menuItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/sell", label: "Sell Gear", icon: Tag },
];

export default function UserMenu() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  if (!isAuthenticated || !currentUser) {
    return (
      <Link
        href="/login"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
        aria-label="Sign in"
      >
        <User size={18} />
      </Link>
    );
  }

  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();

  const handleLogout = () => {
    setOpen(false);
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-700 bg-slate-900 pl-1 pr-3 text-slate-300 transition hover:border-slate-600 hover:text-white"
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-300">
          {initials}
        </div>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-950/40" role="menu">
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="text-sm font-semibold text-white">{currentUser.firstName} {currentUser.lastName}</p>
            <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
                role="menuitem"
              >
                <item.icon size={16} className="text-slate-500" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-800 py-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white"
              role="menuitem"
            >
              <LogOut size={16} className="text-slate-500" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
