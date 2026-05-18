"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBasket } from "lucide-react";

import type { MenuCardItem } from "@/constants/menuData";
import { useBasket } from "@/hooks/useBasket";
import { useFlyToBasket } from "@/hooks/useFlyToBasket";

type BasketQuantityControlProps = {
  buttonClassName: string;
  counterTone?: "dark" | "light";
  flySourceRef?: RefObject<HTMLElement | null>;
  item: MenuCardItem;
};

export function BasketQuantityControl({
  buttonClassName,
  counterTone = "dark",
  flySourceRef,
  item,
}: BasketQuantityControlProps) {
  const controlRef = useRef<HTMLDivElement | null>(null);
  const { add, decrement, increment, quantity } = useBasket(item);
  const { flyToBasket } = useFlyToBasket();
  const hasQuantity = quantity > 0;
  const isLightCounter = counterTone === "light";

  const triggerFly = () => {
    const sourceRect = (
      flySourceRef?.current ?? controlRef.current
    )?.getBoundingClientRect();

    if (!sourceRect) {
      return;
    }

    window.requestAnimationFrame(() => {
      flyToBasket({
        image: item.image,
        sourceRect,
      });
    });
  };

  const handleAdd = () => {
    add(item);
    triggerFly();
  };

  const handleIncrement = () => {
    increment(item);
    triggerFly();
  };

  const handleDecrement = () => {
    decrement(item.id);
  };

  return (
    <div
      ref={controlRef}
      className="w-full"
      onClick={(event) => event.stopPropagation()}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!hasQuantity ? (
          <motion.button
            key="add"
            type="button"
            onClick={handleAdd}
            className={buttonClassName}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <ShoppingBasket aria-hidden="true" className="h-4 w-4" />
            Add to basket
          </motion.button>
        ) : (
          <motion.div
            key="counter"
            className={`grid w-full grid-cols-[2.75rem_1fr_2.75rem] overflow-hidden rounded-md border shadow-inner ${
              isLightCounter
                ? "border-charcoal-700/10 bg-charcoal-700/5"
                : "border-white/10 bg-white/10"
            }`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              aria-label={`Remove one ${item.name}`}
              onClick={handleDecrement}
              className={`flex h-11 items-center justify-center transition-colors duration-200 ${
                isLightCounter
                  ? "bg-charcoal-700 text-white hover:bg-charcoal-800"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Minus aria-hidden="true" className="h-4 w-4" />
            </button>
            <motion.span
              key={quantity}
              className={`flex h-11 items-center justify-center text-sm font-black ${
                isLightCounter ? "text-charcoal-900" : "text-white"
              }`}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.18 }}
            >
              {quantity}
            </motion.span>
            <button
              type="button"
              aria-label={`Add one ${item.name}`}
              onClick={handleIncrement}
              className="flex h-11 items-center justify-center bg-green-500 text-white transition-colors duration-200 hover:bg-green-600"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
