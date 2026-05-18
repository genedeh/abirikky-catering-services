import { cmsPaths, frontendEndpoints } from "@/config/endpoints";
import { fetchJson, withQuery } from "@/services/apiClient";
import type {
  CmsCategory,
  CmsMenuItem,
  PaginatedResponse,
} from "@/types/cms";

export type MenuItemsParams = {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  status?: string;
};

export function getMenuItems(params: MenuItemsParams) {
  return fetchJson<PaginatedResponse<CmsMenuItem>>(
    frontendEndpoints.cms(withQuery(cmsPaths.menuItems, params)),
  );
}

export function getMenuSectionItems(params: { limit: number; category: string }) {
  return fetchJson<{ items: CmsMenuItem[] }>(
    frontendEndpoints.cms(withQuery(cmsPaths.menuSectionItems, params)),
  );
}

export function getMenuItem(slug: string) {
  return fetchJson<{ item: CmsMenuItem }>(
    frontendEndpoints.cms(cmsPaths.menuItem(slug)),
  );
}

export function getMenuCategories() {
  return fetchJson<{ items: CmsCategory[] }>(
    frontendEndpoints.cms(cmsPaths.menuCategories),
  );
}
