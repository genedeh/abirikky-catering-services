import { cmsPaths, frontendEndpoints } from "@/config/endpoints";
import { fetchJson, withQuery } from "@/services/apiClient";
import type { CmsGalleryItem, PaginatedResponse } from "@/types/cms";

export type GalleryItemsParams = {
  page: number;
  limit: number;
  visible: boolean;
};

export function getGalleryItems(params: GalleryItemsParams) {
  return fetchJson<PaginatedResponse<CmsGalleryItem>>(
    frontendEndpoints.cms(withQuery(cmsPaths.galleryItems, params)),
  );
}
