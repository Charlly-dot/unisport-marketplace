"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const storageKey = "unisport-theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem(storageKey) === "dark",
  );

  useEffect(() => {
    document.body.classList.toggle("theme-dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.body.classList.toggle("theme-dark", nextIsDark);
    window.localStorage.setItem(storageKey, nextIsDark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#202024]/20 bg-[#fffdf7] text-[#202024] transition hover:border-[#3757df] hover:text-[#3757df]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Light mode" : "Dark mode"}
      suppressHydrationWarning
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
