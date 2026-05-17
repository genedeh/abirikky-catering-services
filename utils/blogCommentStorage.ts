const BLOG_COMMENT_USER_NAME_KEY = "blog_comment_user_name";

export type BlogCommentReaction = "like" | "dislike";

export function readBlogCommentUserName() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(BLOG_COMMENT_USER_NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function writeBlogCommentUserName(userName: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(BLOG_COMMENT_USER_NAME_KEY, userName);
  } catch {
    // Ignore private browsing or quota-limited storage failures.
  }
}
