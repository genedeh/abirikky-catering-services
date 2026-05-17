"use client";

import { AnimatePresence, motion } from "framer-motion";

type OrderProcessingOverlayProps = {
  isVisible: boolean;
};

export function OrderProcessingOverlay({ isVisible }: OrderProcessingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="fixed inset-0 z-[80000] flex items-center justify-center bg-charcoal-900/80 backdrop-blur-md"
          role="status"
          aria-live="polite"
          aria-label="Preparing WhatsApp order"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-5">
            <span className="h-16 w-16 animate-spin rounded-full border-4 border-gold-500/25 border-t-gold-500" />
            <p className="text-sm font-bold uppercase tracking-wider text-white/75">
              Preparing your WhatsApp order
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
