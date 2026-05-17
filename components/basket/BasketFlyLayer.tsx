"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export type BasketFlyItem = {
  id: string;
  image: string;
  sourceRect: DOMRect;
  targetRect: DOMRect;
};

type BasketFlyLayerProps = {
  flyItems: BasketFlyItem[];
  onComplete: (id: string) => void;
};

export function BasketFlyLayer({ flyItems, onComplete }: BasketFlyLayerProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[25000]">
      <AnimatePresence>
        {flyItems.map((item) => {
          const targetX =
            item.targetRect.left +
            item.targetRect.width / 2 -
            item.sourceRect.width / 2;
          const targetY =
            item.targetRect.top +
            item.targetRect.height / 2 -
            item.sourceRect.height / 2;

          return (
            <motion.div
              key={item.id}
              className="absolute overflow-hidden rounded-lg"
              initial={{
                left: item.sourceRect.left,
                top: item.sourceRect.top,
                width: item.sourceRect.width,
                height: item.sourceRect.height,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                left: targetX,
                top: targetY,
                opacity: 0,
                scale: 0.16,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => onComplete(item.id)}
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="160px"
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
