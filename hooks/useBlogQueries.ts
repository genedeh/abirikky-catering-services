"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import {
  getBlogCategories,
  getBlogPost,
  getBlogPosts,
  trackBlogView,
  type BlogPostsParams,
} from "@/services/blogService";
import { getClientMeta } from "@/services/clientMetaService";
import { toBlogPost } from "@/types/cms";

export function useBlogPostsQuery(params: BlogPostsParams) {
  return useQuery({
    queryKey: queryKeys.blog.list(params),
    queryFn: () => getBlogPosts(params),
    select: (data) => ({
      items: data.items.map(toBlogPost),
      pagination: data.pagination,
    }),
  });
}

export function useBlogPostQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.blog.detail(slug),
    queryFn: () => getBlogPost(slug),
    select: (data) => ({
      post: toBlogPost(data.post),
      relatedPosts: (data.relatedPosts ?? []).map(toBlogPost),
    }),
  });
}

export function useBlogCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.blog.categories,
    queryFn: getBlogCategories,
    select: (data) => [
      { name: "All", slug: "all" },
      ...data.items.map((category) => ({
        name: category.name,
        slug: category.slug,
      })),
    ],
  });
}

export function useClientMetaQuery() {
  return useQuery({
    queryKey: queryKeys.clientMeta,
    queryFn: getClientMeta,
  });
}

export function useTrackBlogViewMutation(postSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const clientMeta = await getClientMeta();

      return trackBlogView(postId, clientMeta);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKeys.blog.detail(postSlug),
        (current: unknown) => {
          if (!current || typeof current !== "object" || !("post" in current)) {
            return current;
          }

          const detail = current as {
            post: { views?: { total: number } };
            relatedPosts?: unknown[];
          };

          return {
            ...detail,
            post: {
              ...detail.post,
              views: { total: data.totalViews },
            },
          };
        },
      );
    },
  });
}
