export const queryKeys = {
  blog: {
    categories: ["blog", "categories"] as const,
    comments: (postId: string) => ["blog", "comments", postId] as const,
    detail: (slug: string) => ["blog", "detail", slug] as const,
    list: (params: unknown) => ["blog", "list", params] as const,
  },
  clientMeta: ["client-meta"] as const,
  gallery: {
    list: (params: unknown) => ["gallery", "list", params] as const,
  },
  menu: {
    categories: ["menu", "categories"] as const,
    detail: (slug: string) => ["menu", "detail", slug] as const,
    list: (params: unknown) => ["menu", "list", params] as const,
    section: (params: unknown) => ["menu", "section", params] as const,
  },
};
