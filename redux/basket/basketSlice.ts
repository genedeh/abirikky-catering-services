import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { MenuCardItem } from "@/constants/menuData";

export type BasketItem = {
  id: string;
  name: string;
  category: MenuCardItem["category"];
  image: string;
  originalItemsLeft: number;
  quantity: number;
};

export type BasketState = {
  items: Record<string, BasketItem>;
};

const initialState: BasketState = {
  items: {},
};

function createBasketItem(item: MenuCardItem): BasketItem {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    image: item.image,
    originalItemsLeft: item.itemsLeft,
    quantity: 0,
  };
}

function incrementBasketItem(state: BasketState, item: MenuCardItem) {
  const basketItem = state.items[item.id] ?? createBasketItem(item);

  if (basketItem.quantity >= basketItem.originalItemsLeft) {
    state.items[item.id] = basketItem;
    return;
  }

  basketItem.quantity += 1;
  state.items[item.id] = basketItem;
}

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<MenuCardItem>) => {
      incrementBasketItem(state, action.payload);
    },
    incrementItem: (state, action: PayloadAction<MenuCardItem>) => {
      incrementBasketItem(state, action.payload);
    },
    decrementItem: (state, action: PayloadAction<string>) => {
      const basketItem = state.items[action.payload];

      if (!basketItem) {
        return;
      }

      basketItem.quantity -= 1;

      if (basketItem.quantity <= 0) {
        delete state.items[action.payload];
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    hydrateBasket: (_state, action: PayloadAction<BasketState>) => {
      return action.payload;
    },
    clearBasket: () => initialState,
  },
});

export const {
  addItem,
  clearBasket,
  decrementItem,
  hydrateBasket,
  incrementItem,
  removeItem,
} = basketSlice.actions;

export const basketReducer = basketSlice.reducer;
