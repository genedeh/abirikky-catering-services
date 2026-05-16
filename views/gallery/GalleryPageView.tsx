"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Loader2, X, ZoomIn, ZoomOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { galleryItems } from "@/constants/galleryData";
import type { GalleryItem } from "@/constants/galleryData";

const ITEMS_PER_PAGE = 8;

const shapeClasses: Record<GalleryItem["shape"], string> = {
  tall: "min-h-[22rem] sm:row-span-3 sm:min-h-0",
  wide: "min-h-[15rem] sm:col-span-2 sm:row-span-2 sm:min-h-0",
  square: "min-h-[16rem] sm:row-span-2 sm:min-h-0",
  large: "min-h-[24rem] sm:col-span-2 sm:row-span-4 sm:min-h-0",
  medium: "min-h-[16rem] sm:row-span-2 sm:min-h-0",
};

export function GalleryPageView() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const visibleItems = galleryItems.slice(0, visibleCount);
  const hasMoreItems = visibleCount < galleryItems.length;

  useEffect(() => {
    document.body.style.overflow = selectedItem ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  const handleLoadMore = () => {
    if (isLoading || !hasMoreItems) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      setVisibleCount((currentCount) =>
        Math.min(currentCount + ITEMS_PER_PAGE, galleryItems.length),
      );
      setIsLoading(false);
    }, 650);
  };

  const handleOpenPreview = (item: GalleryItem) => {
    setSelectedItem(item);
    setZoomLevel(1);
  };

  const handleClosePreview = () => {
    setSelectedItem(null);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((currentZoom) => Math.min(currentZoom + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((currentZoom) => Math.max(currentZoom - 0.25, 0.75));
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-32 pt-nav-h">
      <section className="relative mx-auto w-full max-w-container px-container-x py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute right-4 top-20 hidden select-none font-display text-[7rem] font-bold italic leading-none text-white/[0.035] md:block lg:right-12 lg:text-[10rem]">
          on display
        </div>

        <div className="sticky top-nav-h z-overlay -mx-container-x bg-transparent px-container-x py-5 md:flex md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
              Gallery
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
              Served moments
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-white/70 sm:text-lg">
              A living board of Abirikky events, spreads, bowls, and catering
              details. Real images can drop into these frames when ready.
            </p>
          </div>

          <div className="mt-5 flex items-end gap-2 font-display text-5xl font-bold leading-none text-gold-500/70 md:mt-0 md:block md:text-right md:text-6xl">
            {String(visibleItems.length).padStart(2, "0")}
            <span className="block text-2xl text-white/25">
              /{String(galleryItems.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <motion.div
          layout
          className="relative z-raised mt-12 grid auto-rows-auto grid-cols-1 gap-4 sm:grid-flow-dense sm:auto-rows-[7.5rem] sm:grid-cols-2 md:grid-cols-4 lg:auto-rows-[8rem] lg:gap-5"
        >
          <AnimatePresence initial={false}>
            {visibleItems.map((item, index) => (
              <motion.button
                type="button"
                layout
                key={item.id}
                onClick={() => handleOpenPreview(item)}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                  delay: Math.min(index * 0.025, 0.2),
                }}
                className={`group relative isolate overflow-hidden rounded-lg border border-white/10 bg-white/[0.07] text-left shadow-2xl transition-colors duration-300 hover:border-gold-500/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${shapeClasses[item.shape]}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/[0.04] to-charcoal-900/40" />
                <div className="absolute inset-3 rounded-md border border-white/10 bg-charcoal-700/20" />

                <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-5">
                  <div className="flex h-full min-h-[9rem] items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-charcoal-900/45 text-gold-300 transition-transform duration-300 group-hover:scale-110">
                      <ImageIcon aria-hidden="true" className="h-8 w-8" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 text-white">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/45">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-white">
                        {item.title}
                      </h2>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-green-500 shadow-green-sm" />
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="fixed inset-x-0 bottom-6 z-[9990] flex justify-center px-container-x">
          {hasMoreItems ? (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`inline-flex h-btn-h-lg min-w-56 items-center justify-center rounded-full px-8 text-base font-bold shadow-gold-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 disabled:cursor-wait disabled:hover:translate-y-0 ${
                isLoading
                  ? "bg-transparent text-gold-500 shadow-none"
                  : "bg-gold-500 text-white hover:bg-gold-600"
              }`}
            >
              {isLoading ? (
                <Loader2 aria-hidden="true" className="h-10 w-10 animate-spin" />
              ) : (
                "Load More"
              )}
            </button>
          ) : (
            <p className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/65">
              That&apos;s the full gallery for now.
            </p>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedItem ? (
          <motion.div
            className="fixed inset-0 z-[10002] flex items-center justify-center px-container-x py-10"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedItem.title} preview`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close image preview"
              onClick={handleClosePreview}
              className="absolute inset-0 bg-charcoal-900/70 backdrop-blur-xl"
            />

            <motion.div
              className="relative z-raised flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/10 bg-charcoal-900/90 shadow-2xl"
              initial={{ y: 28, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gold-500">
                    Preview
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-white">
                    {selectedItem.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Zoom out"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.75}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ZoomOut aria-hidden="true" className="h-5 w-5" />
                  </button>

                  <span className="min-w-14 text-center text-sm font-bold text-white/70">
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    type="button"
                    aria-label="Zoom in"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2.5}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ZoomIn aria-hidden="true" className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    aria-label="Close image preview"
                    onClick={handleClosePreview}
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-white transition-colors duration-200 hover:bg-gold-600"
                  >
                    <X aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex min-h-[26rem] flex-1 items-center justify-center overflow-auto bg-black/20 p-6 sm:min-h-[34rem]">
                <motion.div
                  className="flex aspect-[4/3] w-[min(48rem,82vw)] origin-center items-center justify-center rounded-lg border border-white/10 bg-white/[0.08] shadow-2xl"
                  animate={{ scale: zoomLevel }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-gold-500/45 bg-charcoal-900/55 text-gold-300 shadow-gold-sm sm:h-36 sm:w-36">
                    <ImageIcon
                      aria-hidden="true"
                      className="h-14 w-14 sm:h-18 sm:w-18"
                      strokeWidth={2}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
