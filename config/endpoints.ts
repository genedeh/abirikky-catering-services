const CMS_PROXY_BASE = "/api/cms";

export const cmsPaths = {
  blogCategories: "blog-categories",
  blogComments: (postId: string) => `blog-posts/${postId}/comments`,
  blogPost: (slug: string) => `blog-posts/${slug}`,
  blogPostView: (postId: string) => `blog-posts/${postId}/view`,
  blogPosts: "blog-posts",
  commentReaction: (commentId: string) => `blog-comments/${commentId}/reaction`,
  galleryItems: "gallery-items",
  menuCategories: "menu-categories",
  menuItem: (slug: string) => `menu-items/${slug}`,
  menuItems: "menu-items",
  menuSectionItems: "menu-section-items",
};

export const frontendEndpoints = {
  clientMeta: "/api/client-meta",
  cms: (path: string) => `${CMS_PROXY_BASE}/${path.replace(/^\/+/, "")}`,
};
