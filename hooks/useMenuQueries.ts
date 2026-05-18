"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import {
  getMenuCategories,
  getMenuItem,
  getMenuItems,
  getMenuSectionItems,
  type MenuItemsParams,
} from "@/services/menuService";
import { toMenuBadge, toMenuCardItem } from "@/types/cms";

export function useMenuItemsQuery(params: MenuItemsParams) {
  return useQuery({
    queryKey: queryKeys.menu.list(params),
    queryFn: () => getMenuItems(params),
    select: (data) => ({
      items: data.items.map(toMenuCardItem),
      pagination: data.pagination,
    }),
  });
}

export function useMenuSectionItemsQuery(params = { limit: 15, category: "all" }) {
  return useQuery({
    queryKey: queryKeys.menu.section(params),
    queryFn: () => getMenuSectionItems(params),
    select: (data) => data.items.map(toMenuCardItem),
  });
}

export function useMenuItemQuery(slug?: string | null) {
  return useQuery({
    enabled: Boolean(slug),
    queryKey: queryKeys.menu.detail(slug ?? ""),
    queryFn: () => getMenuItem(slug ?? ""),
    select: (data) => toMenuCardItem(data.item),
  });
}

export function useMenuCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.menu.categories,
    queryFn: getMenuCategories,
    select: (data) => [
      { label: "All", slug: "all" },
      ...data.items.map(toMenuBadge),
    ],
  });
}
