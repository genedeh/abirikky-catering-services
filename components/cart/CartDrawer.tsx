"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBasket, X } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { OrderDateTimeModal } from "@/components/cart/OrderDateTimeModal";
import { OrderProcessingOverlay } from "@/components/cart/OrderProcessingOverlay";
import { OrderStatusModal } from "@/components/cart/OrderStatusModal";
import { useBasket } from "@/hooks/useBasket";
import { useWhatsAppOrder } from "@/hooks/useWhatsAppOrder";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const focusableSelector =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const { basketItems, clear, totalQuantity } = useBasket();
  const cartItems = useMemo(() => Object.values(basketItems), [basketItems]);
  const {
    cancelDateTime,
    confirmDateTime,
    copyOrderMessage,
    hasCopied,
    isDateTimeModalOpen,
    isProcessing,
    isStatusModalOpen,
    markOrderSent,
    pendingOrder,
    retryOrder,
    startOrder,
  } = useWhatsAppOrder({
    cartItems,
    onOrderSent: clear,
  });

  const handleDrawerScroll = useCallback(() => {
    setIsScrollbarVisible(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrollbarVisible(false);
    }, 900);
  }, []);

  useEffect(() => {
    if (!isOpen && !isDateTimeModalOpen && !isStatusModalOpen && !isProcessing) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDateTimeModalOpen, isOpen, isProcessing, isStatusModalOpen]);

  useEffect(() => {
    if (!isOpen || isDateTimeModalOpen || isStatusModalOpen || isProcessing) {
      return;
    }

    queueMicrotask(() => setIsScrollbarVisible(false));
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const drawer = drawerRef.current;

      if (!drawer) {
        return;
      }

      const focusableElements = Array.from(
        drawer.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [isDateTimeModalOpen, isOpen, isProcessing, isStatusModalOpen, onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[60000]"
            role="dialog"
            aria-modal="true"
            aria-label="Cart drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close cart drawer"
              onClick={onClose}
              className="absolute inset-0 bg-charcoal-900/55 backdrop-blur-md"
            />

          <motion.aside
            ref={drawerRef}
            className="absolute right-0 top-0 flex h-full w-full max-w-[34rem] flex-col overflow-hidden bg-charcoal-900 shadow-2xl sm:border-l sm:border-white/10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-gold-500">
                  Order Summary
                </p>
                <h2 className="font-display text-4xl font-bold leading-none text-white">
                  Your cart
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close cart drawer"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-gold-500"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </header>

            <div
              onScroll={handleDrawerScroll}
              className={`cart-drawer-scroll min-h-0 flex-1 overflow-y-auto px-5 sm:px-7 ${
                isScrollbarVisible
                  ? "cart-drawer-scroll-visible"
                  : "cart-drawer-scroll-hidden"
              }`}
            >
              {cartItems.length > 0 ? (
                cartItems.map((item) => <CartItem key={item.id} item={item} />)
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-white/5 text-green-500">
                    <ShoppingBasket aria-hidden="true" className="h-7 w-7" />
                  </div>
                  <p className="mt-5 font-display text-3xl font-bold text-white">
                    Your cart is empty
                  </p>
                  <p className="mt-3 max-w-xs text-sm font-medium leading-6 text-white/60">
                    Add a dish from the menu and it will appear here instantly.
                  </p>
                </div>
              )}
            </div>

              <CartSummary onOrderNow={startOrder} totalQuantity={totalQuantity} />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isDateTimeModalOpen ? (
          <OrderDateTimeModal
            isOpen={isDateTimeModalOpen}
            onCancel={cancelDateTime}
            onConfirm={confirmDateTime}
          />
        ) : null}
      </AnimatePresence>

      <OrderProcessingOverlay isVisible={isProcessing} />

      <OrderStatusModal
        hasCopied={hasCopied}
        isOpen={isStatusModalOpen}
        order={pendingOrder}
        onCopy={copyOrderMessage}
        onRetry={retryOrder}
        onSent={markOrderSent}
      />
    </>
  );
}
