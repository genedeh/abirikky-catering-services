import Image from "next/image";
import { ShoppingBasket } from "lucide-react";

import type { MenuCardItem } from "@/constants/menuData";

type MenuCardTone = "light" | "muted" | "dark";

type MenuCardContentProps = {
  item: MenuCardItem;
  tone?: MenuCardTone;
  highlightQuery?: string;
};

const toneStyles: Record<
  MenuCardTone,
  {
    image: string;
    title: string;
    meta: string;
    button: string;
  }
> = {
  light: {
    image: "h-56 bg-charcoal-100 sm:h-72",
    title: "text-2xl text-charcoal-700 sm:text-3xl",
    meta: "text-charcoal-500",
    button: "bg-green-500 text-white hover:bg-green-600",
  },
  muted: {
    image: "h-36 bg-white/20 sm:h-56",
    title: "text-base text-white sm:text-2xl",
    meta: "text-white/80",
    button: "bg-white/20 text-white hover:bg-white/30",
  },
  dark: {
    image: "h-60 bg-white/10 sm:h-64",
    title: "text-2xl text-white",
    meta: "text-white/70",
    button: "bg-green-500 text-white hover:bg-green-600",
  },
};

function renderHighlightedName(name: string, query?: string) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return name;
  }

  const matchIndex = name.toLowerCase().indexOf(trimmedQuery.toLowerCase());

  if (matchIndex === -1) {
    return name;
  }

  const before = name.slice(0, matchIndex);
  const match = name.slice(matchIndex, matchIndex + trimmedQuery.length);
  const after = name.slice(matchIndex + trimmedQuery.length);

  return (
    <>
      {before}
      <span className="rounded-sm bg-green-500/35 px-1 text-white">
        {match.split("").map((letter, index) => (
          <span key={`${letter}-${index}`}>{letter}</span>
        ))}
      </span>
      {after}
    </>
  );
}

export function MenuCardContent({
  item,
  tone = "light",
  highlightQuery,
}: MenuCardContentProps) {
  const styles = toneStyles[tone];

  return (
    <>
      <div className={`relative mx-auto w-full overflow-hidden rounded-lg ${styles.image}`}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          className="scale-125 object-contain p-0"
        />
      </div>

      <div className="mt-6">
        <h3
          className={`text-center font-display font-bold leading-tight ${styles.title}`}
        >
          {renderHighlightedName(item.name, highlightQuery)}
        </h3>

        <div
          className={`mx-auto mt-4 flex w-full flex-col items-center justify-center gap-3 text-center text-sm font-semibold ${styles.meta}`}
        >
          <span>{item.itemsLeft} items left</span>
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-xs font-bold transition-colors duration-200 ${styles.button}`}
          >
            <ShoppingBasket aria-hidden="true" className="h-4 w-4" />
            Add to basket
          </button>
        </div>
      </div>
    </>
  );
}
