"use client";

import {
  createContext,
  type MutableRefObject,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Provider } from "react-redux";

import { BasketFlyLayer, type BasketFlyItem } from "@/components/basket/BasketFlyLayer";
import { hydrateBasket } from "@/redux/basket/basketSlice";
import { store } from "@/redux/store";
import { readBasketStorage, writeBasketStorage } from "@/utils/basketStorage";

type FlyToBasketInput = {
  image: string;
  sourceRect: DOMRect;
};

type BasketAnimationContextValue = {
  basketTargetRef: MutableRefObject<HTMLElement | null>;
  flyToBasket: (input: FlyToBasketInput) => void;
};

export const BasketAnimationContext =
  createContext<BasketAnimationContextValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const basketTargetRef = useRef<HTMLElement | null>(null);
  const [flyItems, setFlyItems] = useState<BasketFlyItem[]>([]);

  useEffect(() => {
    const storedBasket = readBasketStorage();

    if (storedBasket) {
      store.dispatch(hydrateBasket(storedBasket));
    }

    const unsubscribe = store.subscribe(() => {
      writeBasketStorage(store.getState().basket);
    });

    return unsubscribe;
  }, []);

  const removeFlyItem = useCallback((id: string) => {
    setFlyItems((items) => items.filter((item) => item.id !== id));
  }, []);

  const flyToBasket = useCallback(({ image, sourceRect }: FlyToBasketInput) => {
    const targetRect = basketTargetRef.current?.getBoundingClientRect();
    const fallbackRect = new DOMRect(window.innerWidth - 56, 24, 40, 40);
    const resolvedTargetRect = targetRect ?? fallbackRect;

    setFlyItems((items) => [
      ...items,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        image,
        sourceRect,
        targetRect: resolvedTargetRect,
      },
    ]);
  }, []);

  const contextValue = useMemo(
    () => ({
      basketTargetRef,
      flyToBasket,
    }),
    [flyToBasket],
  );

  return (
    <Provider store={store}>
      <BasketAnimationContext.Provider value={contextValue}>
        {children}
        <BasketFlyLayer flyItems={flyItems} onComplete={removeFlyItem} />
      </BasketAnimationContext.Provider>
    </Provider>
  );
}
