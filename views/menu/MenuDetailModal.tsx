"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useRef, useState } from "react";

import { BasketQuantityControl } from "@/components/basket/BasketQuantityControl";
import type { MenuCardItem, MenuCategory } from "@/constants/menuData";

const categoryBadgeStyles: Record<Exclude<MenuCategory, "All">, string> = {
  Rice: "border-gold-500/40 bg-gold-500/18 text-gold-300",
  Swallow: "border-green-500/40 bg-green-500/18 text-green-300",
  Intercontinental: "border-cream-500/40 bg-cream-500/16 text-cream-300",
  Soups: "border-state-error/40 bg-state-error/15 text-red-200",
  Protein: "border-gold-600/40 bg-gold-600/18 text-gold-200",
  Others: "border-white/20 bg-white/10 text-white/80",
};

type MenuDetailModalProps = {
  item: MenuCardItem;
  onClose: () => void;
};

export function MenuDetailModal({ item, onClose }: MenuDetailModalProps) {
  const [previewZoom, setPreviewZoom] = useState(1);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const handleZoomIn = () => {
    setPreviewZoom((currentZoom) => Math.min(currentZoom + 0.25, 2.25));
  };

  const handleZoomOut = () => {
    setPreviewZoom((currentZoom) => Math.max(currentZoom - 0.25, 0.85));
  };

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 top-nav-h z-[20000] flex items-stretch justify-center px-2.5 py-2.5"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} details`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Close menu item preview"
        onClick={onClose}
        className="absolute inset-0 bg-transparent backdrop-blur-xl"
      />

      <motion.div
        className="relative z-raised grid h-full max-h-[calc(100vh-5.75rem)] w-full max-w-none overflow-hidden rounded-2xl border border-white/10 shadow-2xl lg:grid-cols-[1fr_0.86fr]"
        initial={{ y: 32, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 22, scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative flex min-h-[20rem] items-center justify-center overflow-hidden bg-transparent p-6 sm:min-h-[28rem] lg:min-h-full">
          <motion.div
            ref={imageRef}
            className={`relative aspect-square w-[min(92vw,34rem)] lg:w-[min(52vw,48rem)] ${
              previewZoom >= 1.7 ? "lg:cursor-zoom-out" : "lg:cursor-zoom-in"
            }`}
            whileHover={{ scale: previewZoom >= 1.7 ? 1.02 : 1.08 }}
            animate={{ scale: previewZoom }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={previewZoom >= 1.7 ? handleZoomOut : handleZoomIn}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 832px, 92vw"
              className="scale-125 object-contain"
              priority
            />
          </motion.div>

          <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={handleZoomOut}
              disabled={previewZoom <= 0.85}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-charcoal-900/70 text-white backdrop-blur-md transition-colors duration-200 hover:border-gold-500 hover:text-gold-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ZoomOut aria-hidden="true" className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Zoom in"
              onClick={handleZoomIn}
              disabled={previewZoom >= 2.25}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-charcoal-900/70 text-white backdrop-blur-md transition-colors duration-200 hover:border-gold-500 hover:text-gold-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ZoomIn aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <aside className="relative flex min-h-0 flex-col justify-center overflow-y-auto bg-charcoal-900 px-6 py-8 sm:px-8 lg:px-10">
          <button
            type="button"
            aria-label="Close menu item preview"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-gold-500"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>

          <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
            Menu detail
          </p>
          <h2 className="mt-4 font-display text-5xl font-bold leading-none text-white sm:text-6xl">
            {item.name}
          </h2>

          <span
            className={`mt-6 inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-bold ${categoryBadgeStyles[item.category]}`}
          >
            {item.category}
          </span>

          <p className="mt-8 max-w-md text-base font-medium leading-8 text-white/65">
            Add this dish to your basket for catering orders, event spreads, and
            fresh Abirikky-style service.
          </p>

          <div className="mt-8">
            <BasketQuantityControl
              flySourceRef={imageRef}
              item={item}
              buttonClassName="inline-flex h-btn-h-lg w-full items-center justify-center gap-3 rounded-md bg-green-500 px-6 text-base font-bold text-white shadow-green-sm transition-colors duration-200 hover:bg-green-600"
            />
          </div>
        </aside>
      </motion.div>
    </motion.div>
  );
}
