import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { menuBadges, type MenuCategory } from "@/constants/menuData";

type MenuControlsBarProps = {
  activeCategory: MenuCategory;
  isAtEnd: boolean;
  isAtStart: boolean;
  isLoading: boolean;
  searchQuery: string;
  variant?: "inline" | "floating";
  hasResults: boolean;
  onCategoryChange: (category: MenuCategory) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onSearchChange: (query: string) => void;
};

export function MenuControlsBar({
  activeCategory,
  isAtEnd,
  isAtStart,
  isLoading,
  searchQuery,
  variant = "inline",
  hasResults,
  onCategoryChange,
  onNextPage,
  onPreviousPage,
  onSearchChange,
}: MenuControlsBarProps) {
  const isFloating = variant === "floating";

  return (
    <div
      className={
        isFloating
          ? "border-b border-white/10 bg-charcoal-900/40 px-container-x py-4 shadow-2xl backdrop-blur-md"
          : "bg-transparent py-4"
      }
    >
      <div className="mx-auto flex w-full max-w-container flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-5 top-1/2 z-raised flex -translate-y-1/2 items-center justify-center text-white drop-shadow-sm">
              <Search
                aria-hidden="true"
                className="h-5 w-5"
                strokeWidth={2.5}
              />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search dishes"
              className="relative z-base h-14 w-full rounded-full border border-white/10 bg-white/[0.08] pl-16 pr-6 text-base font-semibold text-white outline-none backdrop-blur-md transition-colors duration-200 placeholder:text-white/40 focus:border-green-500"
            />
          </div>

          {hasResults ? (
            <div className="flex items-center justify-end gap-[3px]">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={isAtStart || isLoading}
                aria-label="Previous menu page"
                className="flex h-12 w-12 items-center justify-center rounded-l-full rounded-r-md border border-white/15 bg-white/[0.08] text-white shadow-2xl backdrop-blur-md transition-colors duration-200 hover:border-gold-500 hover:text-gold-500 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft aria-hidden="true" className="h-7 w-7" />
              </button>

              <button
                type="button"
                onClick={onNextPage}
                disabled={isAtEnd || isLoading}
                aria-label="Next menu page"
                className="flex h-12 w-12 items-center justify-center rounded-l-md rounded-r-full border border-white/15 bg-white/[0.08] text-white shadow-2xl backdrop-blur-md transition-colors duration-200 hover:border-gold-500 hover:text-gold-500 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight aria-hidden="true" className="h-7 w-7" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="-mx-container-x overflow-x-auto pl-container-x pr-28 pb-1 [scrollbar-width:none] sm:pr-36 [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center justify-start gap-3 md:justify-center">
            {menuBadges.map((badge) => {
              const isActive = badge.label === activeCategory;

              return (
                <button
                  key={badge.label}
                  type="button"
                  onClick={() => onCategoryChange(badge.label)}
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "border-gold-500 bg-gold-500 text-white shadow-gold-sm"
                      : "border-white/10 bg-white/[0.06] text-white/75 hover:border-gold-500/60 hover:text-white"
                  }`}
                >
                  {badge.icon ? (
                    <span aria-hidden="true" className="text-lg">
                      {badge.icon}
                    </span>
                  ) : null}
                  {badge.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
