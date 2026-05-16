"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { MenuCardContent } from "@/components/menu/MenuCardContent";
import { MenuControlsBar } from "@/views/menu/MenuControlsBar";
import { MenuDetailModal } from "@/views/menu/MenuDetailModal";
import {
  menuItemsByCategory,
  type MenuCardItem,
  type MenuCategory,
} from "@/constants/menuData";

const ITEMS_PER_PAGE = 12;
const SHIMMER_ITEMS = Array.from({ length: ITEMS_PER_PAGE }, (_, index) => index);

const floatingAccents = [
  {
    src: "/bgIcons/bgIcon1.png",
    className: "left-[4%] top-[12rem] h-16 w-24 -rotate-12",
  },
  {
    src: "/bgIcons/bgIcon2.png",
    className: "right-[8%] top-[10rem] h-14 w-24 rotate-12",
  },
  {
    src: "/bgIcons/bgIcon1.png",
    className: "left-[10%] top-[42%] h-14 w-20 rotate-45",
  },
  {
    src: "/bgIcons/bgIcon2.png",
    className: "right-[7%] bottom-[16%] h-16 w-24 -rotate-45",
  },
];

export function MenuPageView() {
  const introRef = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuCardItem | null>(null);
  const [showFloatingControls, setShowFloatingControls] = useState(false);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const categoryItems = menuItemsByCategory[activeCategory];

    if (!query) {
      return categoryItems;
    }

    return categoryItems.filter((item) =>
      item.name.toLowerCase().includes(query),
    );
  }, [activeCategory, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const currentItems = filteredItems.slice(
    pageIndex * ITEMS_PER_PAGE,
    pageIndex * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
  );
  const isAtStart = pageIndex === 0;
  const isAtEnd = pageIndex >= pageCount - 1;

  useEffect(() => {
    setPageIndex(0);
    setIsPageLoading(false);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  useEffect(() => {
    const handleScroll = () => {
      const intro = introRef.current;

      if (!intro) {
        setShowFloatingControls(false);
        return;
      }

      setShowFloatingControls(intro.getBoundingClientRect().bottom <= 72);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handlePageChange = (nextPageIndex: number) => {
    if (
      isPageLoading ||
      nextPageIndex < 0 ||
      nextPageIndex > pageCount - 1 ||
      nextPageIndex === pageIndex
    ) {
      return;
    }

    setPageIndex(nextPageIndex);
  };

  const handleCategoryChange = (category: MenuCategory) => {
    setActiveCategory(category);
  };

  const handleOpenPreview = (item: MenuCardItem) => {
    setSelectedItem(item);
  };

  const handleClosePreview = () => {
    setSelectedItem(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden pt-nav-h">
      <AnimatePresence>
        {showFloatingControls ? (
          <motion.div
            className="fixed inset-x-0 top-nav-h z-[9998]"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <MenuControlsBar
              activeCategory={activeCategory}
              hasResults={filteredItems.length > 0}
              isAtEnd={isAtEnd}
              isAtStart={isAtStart}
              isLoading={isPageLoading}
              searchQuery={searchQuery}
              variant="floating"
              onCategoryChange={handleCategoryChange}
              onNextPage={() => handlePageChange(pageIndex + 1)}
              onPreviousPage={() => handlePageChange(pageIndex - 1)}
              onSearchChange={setSearchQuery}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section className="relative mx-auto w-full max-w-container px-container-x py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute left-[-4rem] top-28 hidden select-none rounded-full bg-gold-500/20 blur-3xl sm:block sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute right-[-5rem] top-[22rem] hidden select-none rounded-full bg-green-500/15 blur-3xl md:block md:h-80 md:w-80" />
        <div className="pointer-events-none absolute bottom-20 left-1/2 hidden h-64 w-64 -translate-x-1/2 rounded-full border border-gold-500/15 md:block" />
        <div className="pointer-events-none absolute right-[14%] top-[36%] hidden h-28 w-28 rounded-full border border-green-500/20 lg:block" />

        {floatingAccents.map((accent) => (
          <span
            key={`${accent.src}-${accent.className}`}
            aria-hidden="true"
            className={`pointer-events-none absolute z-base hidden md:block ${accent.className}`}
          >
            <Image
              src={accent.src}
              alt=""
              fill
              sizes="96px"
              className="object-contain"
            />
          </span>
        ))}

        <div ref={introRef} className="relative z-raised mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
            Abirikky Menu
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
            Choose your taste
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-white/70 sm:text-lg">
            Browse Nigerian favorites, intercontinental plates, soups, proteins,
            and party-ready extras from one place.
          </p>
        </div>

        <div className="relative z-raised mt-12">
          <MenuControlsBar
            activeCategory={activeCategory}
            hasResults={filteredItems.length > 0}
            isAtEnd={isAtEnd}
            isAtStart={isAtStart}
            isLoading={isPageLoading}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onNextPage={() => handlePageChange(pageIndex + 1)}
            onPreviousPage={() => handlePageChange(pageIndex - 1)}
            onSearchChange={setSearchQuery}
          />
        </div>

        {filteredItems.length > 0 ? (
          <div className="relative z-raised mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={isPageLoading ? `loading-${pageIndex}` : pageIndex}
                layout
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {currentItems.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleOpenPreview(item)}
                    className="rounded-xl border border-white/10 bg-white/[0.075] p-5 text-left shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-gold-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                  >
                    <MenuCardContent
                      item={item}
                      tone="dark"
                      highlightQuery={searchQuery}
                    />
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>

            <p className="mt-8 text-center text-sm font-bold text-white/45">
              Page {pageIndex + 1} of {pageCount}
            </p>
          </div>
        ) : (
          <div className="relative z-raised mx-auto mt-16 max-w-xl rounded-xl border border-white/10 bg-white/[0.06] p-8 text-center">
            <p className="font-display text-3xl font-bold text-white">
              No dishes found
            </p>
            <p className="mt-3 text-base font-medium leading-7 text-white/65">
              Try another search or switch categories to keep browsing the
              menu.
            </p>
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedItem ? (
          <MenuDetailModal item={selectedItem} onClose={handleClosePreview} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function MenuCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.075] p-5 shadow-2xl backdrop-blur-sm">
      <div className="relative h-60 overflow-hidden rounded-lg bg-white/10 sm:h-64">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/18 to-transparent bg-[length:200%_100%]" />
      </div>
      <div className="mt-6 space-y-4">
        <div className="relative mx-auto h-7 w-3/4 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/18 to-transparent bg-[length:200%_100%]" />
        </div>
        <div className="relative mx-auto h-4 w-1/2 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/18 to-transparent bg-[length:200%_100%]" />
        </div>
        <div className="relative h-11 overflow-hidden rounded-md bg-green-500/20">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-green-200/25 to-transparent bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
}
