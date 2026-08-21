"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LogoImage from "./LogoImage";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Predict", href: "/predict" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--card-border)] shadow-[0px_4px_25px_rgba(26,26,26,0.08)] py-1"
          : "bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--card-border)]/60 py-2"
      }`}
    >
      <div className="flex justify-between items-center h-16 px-4 md:px-16 max-w-[1440px] mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-auto flex items-center">
            <LogoImage className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-wide transition-all duration-300 relative py-1 ${
                  isActive
                    ? "text-[#C49A24] dark:text-[#f2ca50] font-semibold border-b-2 border-[#C49A24] dark:border-[#f2ca50]"
                    : "text-[var(--text-sub)] hover:text-[#C49A24] dark:hover:text-[#f2ca50]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions (Theme Toggle + CTA) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          <Link
            href="/signup"
            className="relative group overflow-hidden bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:bg-[#B88A16] dark:hover:bg-[#ffe088] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            <span className="relative z-10">Sign Up</span>
            <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[var(--text-sub)] hover:text-[#C49A24] dark:hover:text-[#f2ca50] p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--card-sub-bg)] border-b border-[var(--card-border)] px-6 py-4 flex flex-col gap-3 transition-colors duration-300 animate-fadeInUp">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base py-2 border-b border-[var(--card-border)]/50 ${
                  isActive
                    ? "text-[#C49A24] dark:text-[#f2ca50] font-semibold"
                    : "text-[var(--text-sub)]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/signup"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] text-center font-semibold text-base py-3 rounded-xl mt-2 shadow-md"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
