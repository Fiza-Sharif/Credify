"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import LogoImage from "./LogoImage";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    signout();
    router.push("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

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

        {/* Desktop Actions (Theme Toggle + Profile Badge / Sign Up CTA) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            /* User Profile Badge & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 bg-[var(--card-sub-bg)] border border-[var(--card-border)] hover:border-[#C49A24] dark:hover:border-[#d4af37] py-1.5 px-3 rounded-xl transition-all duration-300 shadow-sm focus:outline-none"
              >
                {/* Profile Picture / Initials */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#C49A24]/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold text-xs flex items-center justify-center shadow-sm">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="text-sm font-semibold text-[var(--text-main)] max-w-[130px] truncate">
                  {user.name}
                </span>
                <span className={`material-symbols-outlined text-base text-[var(--text-muted)] transition-transform duration-300 ${profileDropdownOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl py-2 z-50 animate-fadeInUp transition-colors duration-300">
                  <div className="px-4 py-3 border-b border-[var(--card-border)]">
                    <div className="text-sm font-bold text-[var(--text-main)] truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] truncate">
                      {user.email}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--card-sub-bg)] hover:text-[#C49A24] dark:hover:text-[#f2ca50] transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">account_circle</span>
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--card-sub-bg)] hover:text-[#C49A24] dark:hover:text-[#f2ca50] transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">dashboard</span>
                      <span>Dashboard</span>
                    </Link>
                  </div>

                  <div className="border-t border-[var(--card-border)] pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-[#93000a] dark:text-[#ffb4ab] hover:bg-[#93000a]/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/signup"
              className="relative group overflow-hidden bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:bg-[#B88A16] dark:hover:bg-[#ffe088] transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              <span className="relative z-10">Sign Up</span>
              <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </Link>
          )}
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

          {user ? (
            <div className="pt-2 border-t border-[var(--card-border)] flex flex-col gap-2">
              <div className="flex items-center gap-3 py-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#C49A24]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] font-bold text-xs flex items-center justify-center">
                    {getInitials(user.name)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-[var(--text-main)] truncate">{user.name}</div>
                  <div className="text-xs text-[var(--text-muted)] truncate">{user.email}</div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full bg-[#93000a]/15 text-[#93000a] dark:text-[#ffb4ab] text-center font-semibold text-base py-2.5 rounded-xl border border-[#93000a]/30 mt-1 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#C49A24] dark:bg-[#d4af37] text-white dark:text-[#554300] text-center font-semibold text-base py-3 rounded-xl mt-2 shadow-md"
            >
              Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
