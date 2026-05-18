"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { MenuCardContent } from "@/components/menu/MenuCardContent";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { ErrorStateCard } from "@/components/ui/ErrorStateCard";
import { MenuDetailModal } from "@/views/menu/MenuDetailModal";
import { menuBadges, type MenuCardItem, type MenuCategory } from "@/constants/menuData";
import {
  useMenuCategoriesQuery,
  useMenuSectionItemsQuery,
} from "@/hooks/useMenuQueries";

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuCardItem | null>(null);
  const menuQuery = useMenuSectionItemsQuery({
    limit: 15,
    category: activeCategory,
  });
  const categoriesQuery = useMenuCategoriesQuery();
  const badges = categoriesQuery.data ?? menuBadges;
  const activeItems = useMemo(() => menuQuery.data ?? [], [menuQuery.data]);
  const resolvedActiveIndex =
    activeIndex === null
      ? Math.max(0, Math.floor(activeItems.length / 2))
      : Math.min(activeIndex, Math.max(0, activeItems.length - 1));

  const visibleItems = useMemo(
    () =>
      [resolvedActiveIndex - 1, resolvedActiveIndex, resolvedActiveIndex + 1]
        .filter((itemIndex) => itemIndex >= 0 && itemIndex < activeItems.length)
        .map((itemIndex) => ({
          item: activeItems[itemIndex],
          position: itemIndex - resolvedActiveIndex,
        })),
    [activeItems, resolvedActiveIndex],
  );

  const isAtStart = resolvedActiveIndex === 0;
  const isAtEnd = resolvedActiveIndex === activeItems.length - 1;

  const handleCategoryChange = (category: MenuCategory) => {
    setActiveCategory(category);
    setActiveIndex(null);
  };

  const handlePrevious = () => {
    setActiveIndex(Math.max(resolvedActiveIndex - 1, 0));
  };

  const handleNext = () => {
    setActiveIndex(Math.min(resolvedActiveIndex + 1, activeItems.length - 1));
  };

  const handleClosePreview = () => {
    setSelectedItem(null);
  };

  return (
    <section
      id="menu"
      className="relative isolate w-full overflow-hidden bg-gold-500 py-24 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute left-5 top-5 select-none font-display text-[7rem] font-bold leading-none text-white/10 [writing-mode:vertical-rl] sm:text-[9rem] lg:left-16 lg:text-[11rem]">
        owambe
      </div>
      <div className="pointer-events-none absolute bottom-6 right-3 select-none font-display text-[7rem] font-bold leading-none text-white/10 [writing-mode:vertical-rl] sm:text-[9rem] lg:right-14 lg:text-[11rem]">
        o dun
      </div>

      <div className="relative z-raised mx-auto w-full max-w-container px-container-x">
        <h2 className="text-center font-display text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
          Our Menu
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {badges.map((badge) => {
            const categoryValue = badge.slug ?? badge.label;
            const isActive = categoryValue === activeCategory;

            return (
              <button
                key={categoryValue}
                type="button"
                onClick={() => handleCategoryChange(categoryValue)}
                className={`inline-flex h-14 min-w-24 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-all duration-200 sm:min-w-32 sm:text-base ${
                  isActive
                    ? "border-white bg-white text-gold-600 shadow-lg"
                    : "border-white/35 bg-white/5 text-white hover:border-white/70 hover:bg-white/10"
                }`}
              >
                {badge.label}
              </button>
            );
          })}
        </div>

        {menuQuery.isError ? (
          <ErrorStateCard
            description="We could not load the featured menu. Refresh and try again."
            isRefreshing={menuQuery.isFetching}
            onRefresh={() => void menuQuery.refetch()}
          />
        ) : menuQuery.isLoading ? (
          <div className="relative mx-auto mt-20 h-[38rem] max-w-[21rem] rounded-xl bg-white/20 p-7 shadow-2xl">
            <div className="h-72 rounded-lg bg-white/20" />
            <div className="mx-auto mt-6 h-8 w-3/4 rounded-full bg-white/25" />
            <div className="mt-4 h-11 rounded-md bg-green-500/30" />
          </div>
        ) : activeItems.length === 0 ? (
          <EmptyStateCard
            title="No menu items yet"
            description="Please check back soon for fresh Abirikky dishes."
          />
        ) : (
        <div className="relative mt-20 min-h-[38rem]">
          {!isAtStart ? (
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous menu item"
              className="absolute left-2 top-1/2 z-dropdown flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20 lg:left-0 lg:h-14 lg:w-14"
            >
              <ChevronLeft aria-hidden="true" className="h-7 w-7" />
            </button>
          ) : (
            <p className="absolute left-0 top-1/2 z-dropdown hidden max-w-40 -translate-y-1/2 text-sm font-semibold text-white/90 lg:block">
              Start of the menu. More goodness is this way{" "}
              <span aria-hidden="true">-&gt;</span>
            </p>
          )}

          <div className="relative mx-auto h-[38rem] max-w-5xl overflow-visible">
            <AnimatePresence initial={false}>
              {visibleItems.map(({ item, position }) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  isActive={position === 0}
                  position={position}
                  onSelect={
                    position < 0
                      ? handlePrevious
                      : position > 0
                        ? handleNext
                        : undefined
                  }
                  onPreview={setSelectedItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {!isAtEnd ? (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next menu item"
              className="absolute right-2 top-1/2 z-dropdown flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20 lg:right-0 lg:h-14 lg:w-14"
            >
              <ChevronRight aria-hidden="true" className="h-7 w-7" />
            </button>
          ) : (
            <p className="absolute right-0 top-1/2 z-dropdown hidden max-w-40 -translate-y-1/2 text-right text-sm font-semibold text-white/90 lg:block">
              <span aria-hidden="true">&lt;-</span> That&apos;s all for now. Go
              back for another taste
            </p>
          )}
        </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/menu"
            className="rounded-full bg-white px-10 py-4 text-base font-bold text-gold-600 shadow-lg transition-colors duration-200 hover:bg-cream-100"
          >
            See More
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem ? (
          <MenuDetailModal item={selectedItem} onClose={handleClosePreview} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function MenuCard({
  item,
  isActive,
  position,
  onSelect,
  onPreview,
}: {
  item: MenuCardItem;
  isActive: boolean;
  position: number;
  onSelect?: () => void;
  onPreview: (item: MenuCardItem) => void;
}) {
  const slotX =
    position < 0
      ? "calc(-50% - min(34vw, 18rem))"
      : position > 0
        ? "calc(-50% + min(34vw, 18rem))"
        : "-50%";
  const exitX =
    position < 0
      ? "calc(-50% - min(64vw, 32rem))"
      : "calc(-50% + min(64vw, 32rem))";

  return (
    <motion.article
      initial={{
        opacity: 0,
        scale: 0.78,
        x:
          position > 0
            ? "calc(-50% + min(64vw, 32rem))"
            : "calc(-50% - min(64vw, 32rem))",
      }}
      animate={{
        opacity: isActive ? 1 : 0.7,
        scale: isActive ? 1 : 0.9,
        x: slotX,
        y: isActive ? 0 : 14,
        rotate: position < 0 ? -1 : position > 0 ? 1 : 0,
        zIndex: isActive ? 2 : 1,
      }}
      exit={{ opacity: 0, scale: 0.78, x: exitX }}
      transition={{ type: "spring", stiffness: 220, damping: 30, mass: 0.95 }}
      className={`absolute left-1/2 top-0 rounded-xl ${
        isActive
          ? "w-[14.5rem] bg-white p-5 text-charcoal-700 shadow-2xl sm:w-[21rem] sm:p-7"
          : "w-[9rem] cursor-pointer bg-white/20 p-3 text-white/80 shadow-lg sm:w-[13.5rem] sm:p-5 lg:w-[15rem]"
      }`}
      onClick={isActive ? () => onPreview(item) : onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (isActive) {
            onPreview(item);
            return;
          }

          onSelect?.();
        }
      }}
    >
      <MenuCardContent item={item} tone={isActive ? "light" : "muted"} />
    </motion.article>
  );
}
