import { useContext } from "react";

import { BasketAnimationContext } from "@/context/BasketContext";

export function useFlyToBasket() {
  const context = useContext(BasketAnimationContext);

  if (!context) {
    throw new Error("useFlyToBasket must be used inside BasketProvider");
  }

  return context;
}
