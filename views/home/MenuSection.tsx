"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBasket } from "lucide-react";
import { useMemo, useState } from "react";

import {
  menuBadges,
  menuItemsByCategory,
  type MenuCardItem,
  type MenuCategory,
} from "@/constants/menuData";

const getMiddleIndex = (items: MenuCardItem[]) => Math.floor(items.length / 2);

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("All");
  const [activeIndex, setActiveIndex] = useState(() =>
    getMiddleIndex(menuItemsByCategory.All)
  );

  const activeItems = menuItemsByCategory[activeCategory];

  const visibleItems = useMemo(
    () =>
      [activeIndex - 1, activeIndex, activeIndex + 1]
        .filter((itemIndex) => itemIndex >= 0 && itemIndex < activeItems.length)
        .map((itemIndex) => ({
          item: activeItems[itemIndex],
          position: itemIndex - activeIndex,
        })),
    [activeIndex, activeItems]
  );

  const isAtStart = activeIndex === 0;
  const isAtEnd = activeIndex === activeItems.length - 1;

  const handleCategoryChange = (category: MenuCategory) => {
    setActiveCategory(category);
    setActiveIndex(getMiddleIndex(menuItemsByCategory[category]));
  };

  const handlePrevious = () => {
    setActiveIndex((index) => Math.max(index - 1, 0));
  };

  const handleNext = () => {
    setActiveIndex((index) => Math.min(index + 1, activeItems.length - 1));
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
          {menuBadges.map((badge) => {
            const isActive = badge.label === activeCategory;

            return (
              <button
                key={badge.label}
                type="button"
                onClick={() => handleCategoryChange(badge.label)}
                className={`inline-flex h-14 min-w-24 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-all duration-200 sm:min-w-32 sm:text-base ${
                  isActive
                    ? "border-white bg-white text-gold-600 shadow-lg"
                    : "border-white/35 bg-white/5 text-white hover:border-white/70 hover:bg-white/10"
                }`}
              >
                {badge.icon ? (
                  <span aria-hidden="true" className="text-xl">
                    {badge.icon}
                  </span>
                ) : null}
                {badge.label}
              </button>
            );
          })}
        </div>

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

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            className="rounded-full bg-white px-10 py-4 text-base font-bold text-gold-600 shadow-lg transition-colors duration-200 hover:bg-cream-100"
          >
            See More
          </button>
        </div>
      </div>
    </section>
  );
}

function MenuCard({
  item,
  isActive,
  position,
  onSelect,
}: {
  item: MenuCardItem;
  isActive: boolean;
  position: number;
  onSelect?: () => void;
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
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onSelect) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div
        className={`relative mx-auto overflow-hidden rounded-lg ${
          isActive
            ? "h-56 w-full bg-charcoal-100 sm:h-72"
            : "h-36 w-full bg-white/20 sm:h-56"
        }`}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes={
            isActive
              ? "(min-width: 640px) 336px, 232px"
              : "(min-width: 1024px) 240px, (min-width: 640px) 216px, 144px"
          }
          className="scale-125 object-contain p-0"
        />
      </div>

      <div className="mt-6">
        <h3
          className={`text-center font-display font-bold leading-tight ${
            isActive
              ? "text-2xl text-charcoal-700 sm:text-3xl"
              : "text-base text-white sm:text-2xl"
          }`}
        >
          {item.name}
        </h3>

        <div
          className={`mx-auto mt-4 flex w-full flex-col items-center justify-center gap-3 text-center text-sm font-semibold ${
            isActive ? "text-charcoal-500" : "text-white/80"
          }`}
        >
          <span>{item.itemsLeft} items left</span>
          <button
            type="button"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-xs font-bold transition-colors duration-200 ${
              isActive
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <ShoppingBasket aria-hidden="true" className="h-4 w-4" />
            Add to basket
          </button>
        </div>
      </div>
    </motion.article>
  );
}
