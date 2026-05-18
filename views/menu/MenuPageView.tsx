"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { MenuCardContent } from "@/components/menu/MenuCardContent";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { ErrorStateCard } from "@/components/ui/ErrorStateCard";
import { MenuControlsBar } from "@/views/menu/MenuControlsBar";
import { MenuDetailModal } from "@/views/menu/MenuDetailModal";
import type { MenuCardItem, MenuCategory } from "@/constants/menuData";
import {
  useMenuCategoriesQuery,
  useMenuItemQuery,
  useMenuItemsQuery,
} from "@/hooks/useMenuQueries";

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

type MenuPageViewProps = {
  initialSlug?: string;
};

export function MenuPageView({ initialSlug }: MenuPageViewProps) {
  const pathname = usePathname();
  const router = useRouter();
  const introRef = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [previewItem, setPreviewItem] = useState<MenuCardItem | null>(null);
  const [showFloatingControls, setShowFloatingControls] = useState(false);
  const routeSlug = useMemo(
    () =>
      pathname === "/menu"
        ? null
        : initialSlug ?? pathname.replace(/^\/menu\//, "").split("/")[0],
    [initialSlug, pathname],
  );
  const menuQuery = useMenuItemsQuery({
    page: pageIndex + 1,
    limit: ITEMS_PER_PAGE,
    category: activeCategory === "all" ? undefined : activeCategory,
    search: searchQuery,
    status: "available",
  });
  const categoriesQuery = useMenuCategoriesQuery();
  const menuItemQuery = useMenuItemQuery(routeSlug);
  const currentItems = menuQuery.data?.items ?? [];
  const pagination = menuQuery.data?.pagination;
  const pageCount = Math.max(1, pagination?.totalPages ?? 1);
  const isAtStart = pageIndex === 0;
  const isAtEnd = !pagination?.hasNextPage;
  const isPageLoading = menuQuery.isLoading || menuQuery.isFetching;
  const selectedItem = previewItem ?? menuItemQuery.data ?? null;
  const invalidSlug = routeSlug && menuItemQuery.isError ? routeSlug : null;

  useEffect(() => {
    document.body.style.overflow = selectedItem && !invalidSlug ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [invalidSlug, selectedItem]);

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
      menuQuery.isFetching ||
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
    setPageIndex(0);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPageIndex(0);
  };

  const handleOpenPreview = (item: MenuCardItem) => {
    setPreviewItem(item);
  };

  const handleClosePreview = () => {
    setPreviewItem(null);

    if (pathname !== "/menu") {
      router.push("/menu");
    }
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
              categories={categoriesQuery.data}
              hasResults={currentItems.length > 0}
              isAtEnd={isAtEnd}
              isAtStart={isAtStart}
              isLoading={isPageLoading}
              searchQuery={searchQuery}
              variant="floating"
              onCategoryChange={handleCategoryChange}
              onNextPage={() => handlePageChange(pageIndex + 1)}
              onPreviousPage={() => handlePageChange(pageIndex - 1)}
              onSearchChange={handleSearchChange}
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
            categories={categoriesQuery.data}
            hasResults={currentItems.length > 0}
            isAtEnd={isAtEnd}
            isAtStart={isAtStart}
            isLoading={isPageLoading}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onNextPage={() => handlePageChange(pageIndex + 1)}
            onPreviousPage={() => handlePageChange(pageIndex - 1)}
            onSearchChange={handleSearchChange}
          />
        </div>

        {menuQuery.isError ? (
          <ErrorStateCard
            description="We could not load the menu from the CMS. Refresh and try again."
            isRefreshing={menuQuery.isFetching}
            onRefresh={() => void menuQuery.refetch()}
          />
        ) : isPageLoading && currentItems.length === 0 ? (
          <div className="relative z-raised mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SHIMMER_ITEMS.map((item) => (
              <MenuCardSkeleton key={item} />
            ))}
          </div>
        ) : currentItems.length > 0 ? (
          <div className="relative z-raised mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={pageIndex}
                layout
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {currentItems.map((item) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={item.id}
                    onClick={() => handleOpenPreview(item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleOpenPreview(item);
                      }
                    }}
                    className="rounded-xl border border-white/10 bg-white/[0.075] p-5 text-left shadow-2xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-gold-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                  >
                    <MenuCardContent
                      item={item}
                      tone="dark"
                      highlightQuery={searchQuery}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            <p className="mt-8 text-center text-sm font-bold text-white/45">
              Page {pagination?.page ?? pageIndex + 1} of {pageCount}
            </p>
          </div>
        ) : (
          <EmptyStateCard
            title="No dishes found"
            description="Try another search or switch categories to keep browsing the menu."
          />
        )}

        {invalidSlug ? (
          <ErrorStateCard
            title="Menu item not found"
            description={`We could not find a dish for "${invalidSlug}". Refresh or browse the menu below and choose another taste.`}
            isRefreshing={menuItemQuery.isFetching}
            onRefresh={() => void menuItemQuery.refetch()}
          />
        ) : null}
      </section>

      <AnimatePresence>
        {selectedItem && !invalidSlug ? (
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
