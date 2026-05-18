import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { MenuCardItem } from "@/constants/menuData";
import {
  addItem,
  clearBasket,
  decrementItem,
  incrementItem,
  removeItem,
} from "@/redux/basket/basketSlice";
import type { AppDispatch, RootState } from "@/redux/store";

export function useBasket(item?: MenuCardItem) {
  const dispatch = useDispatch<AppDispatch>();
  const basketItems = useSelector((state: RootState) => state.basket.items);

  const totalQuantity = useMemo(
    () =>
      Object.values(basketItems).reduce(
        (total, basketItem) => total + basketItem.quantity,
        0,
      ),
    [basketItems],
  );

  const quantity = item ? basketItems[item.id]?.quantity ?? 0 : 0;

  const add = useCallback(
    (menuItem: MenuCardItem) => {
      dispatch(addItem(menuItem));
    },
    [dispatch],
  );

  const increment = useCallback(
    (menuItem: MenuCardItem) => {
      dispatch(incrementItem(menuItem));
    },
    [dispatch],
  );

  const decrement = useCallback(
    (itemId: string) => {
      dispatch(decrementItem(itemId));
    },
    [dispatch],
  );

  const remove = useCallback(
    (itemId: string) => {
      dispatch(removeItem(itemId));
    },
    [dispatch],
  );

  const clear = useCallback(() => {
    dispatch(clearBasket());
  }, [dispatch]);

  return {
    add,
    basketItems,
    clear,
    decrement,
    increment,
    quantity,
    remove,
    totalQuantity,
  };
}
