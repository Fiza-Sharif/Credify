import Link from "next/link";
import LogoImage from "./LogoImage";

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-[#f2ca50] w-full py-12 border-t border-[var(--card-border)] mt-auto relative z-10 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-16 max-w-[1440px] mx-auto">
        {/* Brand & Copyright */}
        <div className="flex flex-col gap-4 md:col-span-1">
          <div className="h-10 w-fit flex items-center">
            <LogoImage className="h-9 w-auto object-contain" />
          </div>
          <div className="text-xs text-[var(--text-sub)] uppercase tracking-wider opacity-70">
            © 2026 Credify AI. All rights reserved. Precision Wealth Management.
          </div>
        </div>

        {/* Spacer for Grid alignment */}
        <div className="hidden md:block"></div>

        {/* Links */}
        <div className="md:col-span-2 flex flex-wrap gap-x-8 gap-y-4 justify-start md:justify-end items-center">
          <Link
            href="#"
            className="text-sm text-[var(--text-sub)] hover:text-[#f2ca50] transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-[var(--text-sub)] hover:text-[#f2ca50] transition-colors duration-200"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm text-[var(--text-sub)] hover:text-[#f2ca50] transition-colors duration-200"
          >
            Security
          </Link>
          <Link
            href="#"
            className="text-sm text-[var(--text-sub)] hover:text-[#f2ca50] transition-colors duration-200"
          >
            Institutional
          </Link>
          <Link
            href="#"
            className="text-sm text-[var(--text-sub)] hover:text-[#f2ca50] transition-colors duration-200"
          >
            Careers
          </Link>
        </div>
      </div>
    </footer>
  );
}
