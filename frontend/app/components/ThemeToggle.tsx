"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={
        className ||
        "relative w-10 h-10 rounded-xl bg-[var(--card-sub-bg)] border border-[var(--card-border)] text-[#C49A24] dark:text-[#f2ca50] hover:border-[#C49A24] dark:hover:border-[#d4af37] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm overflow-hidden"
      }
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Dark/Light Theme"
    >
      <span className="material-symbols-outlined text-xl transition-transform duration-500 hover:rotate-180">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
