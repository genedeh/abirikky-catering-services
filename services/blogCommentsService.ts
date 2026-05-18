import { cmsPaths, frontendEndpoints } from "@/config/endpoints";
import { fetchJson } from "@/services/apiClient";
import type {
  CmsBlogComment,
  CommentReactionInput,
  CreateCommentInput,
} from "@/types/cms";

export function getBlogComments(postId: string) {
  return fetchJson<{ items: CmsBlogComment[] }>(
    frontendEndpoints.cms(cmsPaths.blogComments(postId)),
  );
}

export function createBlogComment(postId: string, input: CreateCommentInput) {
  return fetchJson<CmsBlogComment>(
    frontendEndpoints.cms(cmsPaths.blogComments(postId)),
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function reactToBlogComment(
  commentId: string,
  input: CommentReactionInput,
) {
  return fetchJson<{ reactionType?: CommentReactionInput["reactionType"] }>(
    frontendEndpoints.cms(cmsPaths.commentReaction(commentId)),
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
