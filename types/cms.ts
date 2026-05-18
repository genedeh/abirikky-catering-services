import type { GalleryItem } from "@/constants/galleryData";
import type { BlogPost } from "@/constants/blogData";
import type { BlogComment } from "@/constants/blogCommentsData";
import type { MenuBadge, MenuCardItem } from "@/constants/menuData";

export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export type CmsCategory = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
};

export type CmsMedia = {
  id: string;
  url: string;
  alt?: string | null;
  type?: "image" | "video" | string;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
};

export type CmsMenuItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  availabilityStatus?: string;
  displayOrder?: number;
  category?: CmsCategory | null;
  image?: CmsMedia | null;
};

export type CmsGalleryItem = {
  id: string;
  title: string;
  slug: string;
  layoutShape?: GalleryItem["shape"] | string | null;
  visibilityStatus?: string;
  media?: CmsMedia | null;
  image?: CmsMedia | null;
};

export type CmsAuthor = {
  id: string;
  name: string;
  slug: string;
};

export type CmsBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  status?: string;
  publishedAt: string;
  readTime: string;
  author?: CmsAuthor | null;
  category?: CmsCategory | null;
  coverImage?: CmsMedia | null;
  views?: { total: number };
  comments?: { total: number };
};

export type BlogPostDetailResponse = {
  post: CmsBlogPost;
  relatedPosts?: CmsBlogPost[];
};

export type CmsBlogComment = {
  id: string;
  blogPostId: string;
  parentCommentId: string | null;
  commenterName: string;
  commentText: string;
  status: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
  replies: CmsBlogComment[];
  isOptimistic?: boolean;
  failed?: boolean;
};

export type CreateCommentInput = {
  parentCommentId: string | null;
  commenterName: string;
  commentText: string;
};

export type CommentReactionInput = {
  reactionType: "like" | "dislike";
};

export type TrackBlogViewResponse = {
  blogPostId: string;
  totalViews: number;
  counted: boolean;
};

export type ClientMeta = {
  ip: string | null;
};

export type MenuCategoryWithAll = MenuBadge & {
  slug: string;
};

export function toMenuCardItem(item: CmsMenuItem): MenuCardItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description ?? "",
    availabilityStatus: item.availabilityStatus,
    category: item.category?.name ?? "Others",
    categorySlug: item.category?.slug ?? "others",
    image: item.image?.url ?? "/food-placeholder.svg",
    imageAlt: item.image?.alt ?? item.name,
  };
}

export function toMenuBadge(category: CmsCategory): MenuCategoryWithAll {
  return {
    label: category.name,
    slug: category.slug,
    icon: category.icon ?? undefined,
  };
}

export function toGalleryItem(item: CmsGalleryItem): GalleryItem {
  const media = item.media ?? item.image ?? null;
  const shape = item.layoutShape ?? "medium";

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    shape: isGalleryShape(shape) ? shape : "medium",
    media,
  };
}

export function toBlogPost(post: CmsBlogPost): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category?.name ?? "Announcements",
    categorySlug: post.category?.slug ?? "announcements",
    excerpt: post.excerpt,
    markdownContent: post.content ?? "",
    content: (post.content ?? "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    author: post.author?.name ?? "Abirikky Team",
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    commentCount: post.comments?.total ?? 0,
    image: post.coverImage?.url ?? "/food-placeholder.svg",
    imageAlt: post.coverImage?.alt ?? post.title,
    featured: false,
    viewsTotal: post.views?.total ?? 0,
  };
}

export function toBlogComment(comment: CmsBlogComment): BlogComment {
  return {
    id: comment.id,
    postSlug: comment.blogPostId,
    blogPostId: comment.blogPostId,
    parentCommentId: comment.parentCommentId,
    author: comment.commenterName,
    body: comment.commentText,
    createdAtLabel: formatRelativeDate(comment.createdAt),
    likes: comment.likesCount,
    dislikes: comment.dislikesCount,
    replies: comment.replies.map(toBlogComment),
    status: comment.status,
    isUserComment: comment.isOptimistic,
    failed: comment.failed,
  };
}

function isGalleryShape(shape: string): shape is GalleryItem["shape"] {
  return ["tall", "wide", "square", "large", "medium"].includes(shape);
}

function formatRelativeDate(dateValue: string) {
  const createdAt = new Date(dateValue).getTime();
  const deltaSeconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000));

  if (deltaSeconds < 60) {
    return "just now";
  }

  const deltaMinutes = Math.floor(deltaSeconds / 60);

  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }

  const deltaHours = Math.floor(deltaMinutes / 60);

  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  return `${Math.floor(deltaHours / 24)}d ago`;
}
