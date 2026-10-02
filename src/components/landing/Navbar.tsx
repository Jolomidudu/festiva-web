"use client";

import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="relative z-50 border-b border-[#ebe8e1]/80 bg-[#faf9f6]/95 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="relative z-50 shrink-0"
        >
          <span className="serif text-3xl tracking-tight text-[#193c32]">
            Festyvibe
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#686e69] transition-colors hover:text-[#193c32]"
            >
              {item.label}
            </a>
          ))}

          <Link
            href="/login"
            className="text-sm font-medium text-[#686e69] transition-colors hover:text-[#193c32]"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-[#193c32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#244c40]"
          >
            Get started
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd9d0] bg-white text-[#193c32] transition hover:bg-[#f3f1eb] md:hidden"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden ${
          mobileOpen
            ? "pointer-events-auto max-h-[500px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        } overflow-hidden border-t border-[#ebe8e1] bg-[#faf9f6] transition-all duration-300 ease-in-out`}
      >
        <div className="mx-auto max-w-7xl px-5 pb-7 pt-4 sm:px-6">
          <div className="flex flex-col">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="border-b border-[#ebe8e1] py-4 text-base font-medium text-[#193c32]"
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="border-b border-[#ebe8e1] py-4 text-base font-medium text-[#193c32]"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              onClick={closeMobileMenu}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#193c32] px-5 py-4 text-sm font-semibold text-white"
            >
              Get started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}