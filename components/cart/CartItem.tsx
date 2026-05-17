"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { MenuCardItem } from "@/constants/menuData";
import type { BasketItem as BasketStateItem } from "@/redux/basket/basketSlice";
import { useBasket } from "@/hooks/useBasket";

type CartItemProps = {
  item: BasketStateItem;
};

function toMenuCardItem(item: BasketStateItem): MenuCardItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    image: item.image,
    itemsLeft: item.originalItemsLeft,
  };
}

export function CartItem({ item }: CartItemProps) {
  const menuItem = toMenuCardItem(item);
  const { decrement, increment, remove, remainingCount } = useBasket(menuItem);
  const canIncrement = remainingCount > 0;

  return (
    <article className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-white/10 py-5 sm:grid-cols-[8rem_1fr]">
      <div className="relative h-28 w-full sm:h-32">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="144px"
          className="scale-125 object-contain"
        />
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-2xl font-bold leading-tight text-white">
              {item.name}
            </h3>
            <p className="mt-1 text-sm font-bold text-gold-500">
              {item.category}
            </p>
            <p className="mt-2 text-sm font-semibold text-white/55">
              {remainingCount} items left
            </p>
          </div>

          <button
            type="button"
            aria-label={`Remove ${item.name} from cart`}
            onClick={() => remove(item.id)}
            className="inline-flex items-center gap-2 rounded-md bg-gold-500 px-3 py-2 text-xs font-bold text-white transition-colors duration-200 hover:bg-gold-600"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Remove
          </button>
        </div>

        <div className="mt-5">
          <div className="grid w-full max-w-48 grid-cols-[3rem_1fr_3rem] overflow-hidden rounded-md border border-white/10 bg-charcoal-800 shadow-inner">
            <button
              type="button"
              aria-label={`Decrease ${item.name} quantity`}
              onClick={() => decrement(item.id)}
              className="flex h-11 items-center justify-center bg-charcoal-700 text-white transition-colors duration-200 hover:bg-charcoal-600"
            >
              <Minus aria-hidden="true" className="h-4 w-4" />
            </button>
            <span className="flex h-11 items-center justify-center text-sm font-black text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${item.name} quantity`}
              onClick={() => increment(menuItem)}
              disabled={!canIncrement}
              className="flex h-11 items-center justify-center bg-green-500 text-white transition-colors duration-200 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
