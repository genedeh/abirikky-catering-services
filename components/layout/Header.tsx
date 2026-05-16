"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const navigationItems = [
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
];

export function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const isNavItemActive = (href: string) => {
    if (href === "/gallery") {
      return pathname === "/gallery";
    }

    if (href === "/menu") {
      return pathname === "/menu";
    }

    return false;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 12);
      const menuSection = document.getElementById("menu");

      if (!menuSection) {
        setIsMenuActive(false);
        return;
      }

      const menuBounds = menuSection.getBoundingClientRect();
      setIsMenuActive(menuBounds.top <= 80 && menuBounds.bottom >= 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const drawer = (
    <div
      aria-hidden={!isDrawerOpen}
      className={`fixed inset-0 z-[10001] transition-opacity duration-300 ease-out-exp lg:hidden ${
        isDrawerOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-charcoal-900/55 backdrop-blur-md"
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-[min(21rem,86vw)] flex-col bg-charcoal-900/95 px-6 py-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out-exp ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Image
            src="/logoFull.png"
            alt="Abirikky"
            width={180}
            height={64}
            priority
            className="h-auto w-32"
          />

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsDrawerOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="mt-12 flex flex-col gap-6 text-xl font-semibold"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isNavItemActive(item.href) ? "page" : undefined}
              onClick={() => setIsDrawerOpen(false)}
              className={
                isNavItemActive(item.href)
                  ? "text-gold-500"
                  : "text-white/85 transition-colors duration-200 hover:text-gold-500"
              }
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/#contact"
            onClick={() => setIsDrawerOpen(false)}
            className="mt-4 rounded-md border-2 border-green-500 px-5 py-3 text-center text-green-500 transition-colors duration-200 hover:border-gold-500 hover:text-gold-500"
          >
            Contact us
          </Link>
        </nav>
      </aside>
    </div>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[10000] transition-colors duration-300 ${
        isMenuActive
          ? "border-b border-white/15 bg-gold-500/30 shadow-sm backdrop-blur-md"
          : hasScrolled
          ? "border-b border-white/10 bg-charcoal-900/35 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-nav-h w-full max-w-container items-center justify-between px-container-x lg:-left-[30px]">
        <Link
          href="/"
          aria-label="Abirikky home"
          className={`shrink-0 transition-colors duration-300 ${
            isMenuActive
              ? "rounded-lg bg-charcoal-900 px-3 py-2 shadow-sm"
              : ""
          }`}
        >
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
              aria-current={isNavItemActive(item.href) ? "page" : undefined}
              className={
                isNavItemActive(item.href)
                  ? `font-bold transition-colors duration-200 ${
                      isMenuActive ? "text-charcoal-700" : "text-gold-500"
                    }`
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

        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setIsDrawerOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20 lg:hidden"
        >
          <Menu aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>

      {isMounted ? createPortal(drawer, document.body) : null}
    </header>
  );
}
