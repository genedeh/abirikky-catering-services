"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigationItems = [
  { label: "Menu", href: "/#menu", isActive: true },
  { label: "Foods", href: "/#foods" },
  { label: "Services", href: "/#services" },
  { label: "About us", href: "/#about" },
];

export function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-top transition-colors duration-300 ${
        hasScrolled
          ? "border-b border-white/10 bg-charcoal-900/35 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="relative -left-[30px] mx-auto flex h-nav-h w-full max-w-container items-center justify-between px-container-x">
        <Link href="/" aria-label="Abirikky home" className="shrink-0">
          <Image
            src="/logoFull.png"
            alt="Abirikky"
            width={180}
            height={64}
            priority
            className="h-auto w-32 sm:w-40 lg:w-44"
          />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 text-base font-medium lg:flex"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.isActive ? "page" : undefined}
              className={
                item.isActive
                  ? "font-bold text-gold-500 transition-colors duration-200"
                  : "text-white/85 transition-colors duration-200 hover:text-gold-500"
              }
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/#contact"
            className="rounded-md border-2 border-green-500 px-5 py-2 text-green-500 transition-colors duration-200 hover:border-gold-500 hover:text-gold-500"
          >
            Contact us
          </Link>
        </nav>
      </div>
    </header>
  );
}
