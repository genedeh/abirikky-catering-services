"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, RotateCcw } from "lucide-react";

import type { PendingWhatsAppOrder } from "@/utils/whatsappOrder";

type OrderStatusModalProps = {
  hasCopied: boolean;
  isOpen: boolean;
  order: PendingWhatsAppOrder | null;
  onCopy: () => void;
  onRetry: () => void;
  onSent: () => void;
};

export function OrderStatusModal({
  hasCopied,
  isOpen,
  order,
  onCopy,
  onRetry,
  onSent,
}: OrderStatusModalProps) {
  return (
    <AnimatePresence>
      {isOpen && order ? (
        <motion.div
          className="fixed inset-0 z-[70000] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="WhatsApp order status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-charcoal-900/65 backdrop-blur-md" />

          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-charcoal-900 p-6 shadow-2xl sm:p-7"
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
              WhatsApp order
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold leading-none text-white">
              Did you successfully send your order on WhatsApp?
            </h2>
            <p className="mt-4 text-sm font-medium leading-6 text-white/65">
              Your order summary is saved temporarily, so you can retry or copy
              it if WhatsApp did not open correctly.
            </p>

            <div className="mt-6 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs font-medium leading-5 text-white/65">
              <pre className="whitespace-pre-wrap font-body">
                {order.orderMessage}
              </pre>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={onSent}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-green-500 px-4 text-sm font-bold text-white shadow-green-sm transition-colors duration-200 hover:bg-green-600"
              >
                <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                Yes, Order Sent
              </button>

              <button
                type="button"
                onClick={onRetry}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-gold-500 px-4 text-sm font-bold text-gold-500 transition-colors duration-200 hover:bg-gold-500 hover:text-white"
              >
                <RotateCcw aria-hidden="true" className="h-5 w-5" />
                Retry
              </button>

              <button
                type="button"
                onClick={onCopy}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-4 text-sm font-bold text-white transition-colors duration-200 hover:border-green-500 hover:text-green-500"
              >
                <Copy aria-hidden="true" className="h-5 w-5" />
                {hasCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
