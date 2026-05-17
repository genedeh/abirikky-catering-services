import type { BasketState } from "@/redux/basket/basketSlice";

const BASKET_STORAGE_KEY = "user_basket";

export function readBasketStorage(): BasketState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedBasket = window.localStorage.getItem(BASKET_STORAGE_KEY);

    if (!storedBasket) {
      return null;
    }

    return JSON.parse(storedBasket) as BasketState;
  } catch {
    return null;
  }
}

export function writeBasketStorage(basketState: BasketState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basketState));
  } catch {
    // Storage can fail in private browsing or quota-limited environments.
  }
}
