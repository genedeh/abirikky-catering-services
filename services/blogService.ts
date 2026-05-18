import { cmsPaths, frontendEndpoints } from "@/config/endpoints";
import { fetchJson, withQuery } from "@/services/apiClient";
import type {
  BlogPostDetailResponse,
  CmsBlogPost,
  CmsCategory,
  PaginatedResponse,
  TrackBlogViewResponse,
} from "@/types/cms";

export type BlogPostsParams = {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  status?: string;
};

export function getBlogPosts(params: BlogPostsParams) {
  return fetchJson<PaginatedResponse<CmsBlogPost>>(
    frontendEndpoints.cms(withQuery(cmsPaths.blogPosts, params)),
  );
}

export function getBlogPost(slug: string) {
  return fetchJson<BlogPostDetailResponse>(
    frontendEndpoints.cms(
      withQuery(cmsPaths.blogPost(slug), { includeRelated: true }),
    ),
  );
}

export function getBlogCategories() {
  return fetchJson<{ items: CmsCategory[] }>(
    frontendEndpoints.cms(cmsPaths.blogCategories),
  );
}

export function trackBlogView(postId: string, clientMeta?: { ip: string | null }) {
  return fetchJson<TrackBlogViewResponse>(
    frontendEndpoints.cms(cmsPaths.blogPostView(postId)),
    {
      method: "POST",
      body: JSON.stringify({ clientMeta }),
    },
  );
}
