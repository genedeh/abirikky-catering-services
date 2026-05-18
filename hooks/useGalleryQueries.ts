"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import {
  getGalleryItems,
  type GalleryItemsParams,
} from "@/services/galleryService";
import { toGalleryItem } from "@/types/cms";

export function useGalleryItemsQuery(params: GalleryItemsParams) {
  return useQuery({
    queryKey: queryKeys.gallery.list(params),
    queryFn: () => getGalleryItems(params),
    select: (data) => ({
      items: data.items.map(toGalleryItem),
      pagination: data.pagination,
    }),
  });
}
