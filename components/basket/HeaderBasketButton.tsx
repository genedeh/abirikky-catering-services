"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react";

import { BasketBurst } from "@/components/basket/BasketBurst";
import { useBasket } from "@/hooks/useBasket";
import { useFlyToBasket } from "@/hooks/useFlyToBasket";

type HeaderBasketButtonProps = {
  badgeTone?: "gold" | "green";
  className?: string;
  onOpenCart: () => void;
};

export function HeaderBasketButton({
  badgeTone = "gold",
  className = "",
  onOpenCart,
}: HeaderBasketButtonProps) {
  const { totalQuantity } = useBasket();
  const { basketTargetRef } = useFlyToBasket();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [renderedQuantity, setRenderedQuantity] = useState(totalQuantity);
  const [isBursting, setIsBursting] = useState(false);

  const updateTarget = useCallback(() => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      basketTargetRef.current = button;
    }
  }, [basketTargetRef]);

  const handleButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;

      if (node) {
        window.requestAnimationFrame(updateTarget);
      }
    },
    [updateTarget],
  );

  useEffect(() => {
    updateTarget();
    window.addEventListener("resize", updateTarget);

    return () => {
      window.removeEventListener("resize", updateTarget);
    };
  }, [renderedQuantity, updateTarget]);

  useEffect(() => {
    if (totalQuantity > 0) {
      setIsBursting(false);
      setRenderedQuantity(totalQuantity);
      return;
    }

    if (renderedQuantity > 0) {
      setIsBursting(true);
      const timeoutId = window.setTimeout(() => {
        setRenderedQuantity(0);
        setIsBursting(false);
      }, 460);

      return () => window.clearTimeout(timeoutId);
    }
  }, [renderedQuantity, totalQuantity]);

  return (
    <>
      <AnimatePresence>
        {renderedQuantity > 0 || isBursting ? (
          <motion.button
            ref={handleButtonRef}
            type="button"
            aria-label={`${renderedQuantity} items in basket`}
            onClick={onOpenCart}
            className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-green-500/50 bg-charcoal-900/55 text-green-500 shadow-green-sm backdrop-blur-md transition-colors duration-200 hover:bg-green-500 hover:text-white ${className}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: isBursting ? 0 : 1,
              scale: isBursting ? 1.25 : 1,
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <ShoppingBasket aria-hidden="true" className="h-5 w-5" />
            {!isBursting ? (
              <motion.span
                key={renderedQuantity}
                className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.7rem] font-black leading-none text-white ${
                  badgeTone === "green" ? "bg-green-500" : "bg-gold-500"
                }`}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              >
                {renderedQuantity}
              </motion.span>
            ) : (
              <BasketBurst />
            )}
          </motion.button>
        ) : null}
      </AnimatePresence>
    </>
  );
}
