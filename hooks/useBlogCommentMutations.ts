"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import {
  createBlogComment,
  reactToBlogComment,
} from "@/services/blogCommentsService";
import type {
  CmsBlogComment,
  CommentReactionInput,
  CreateCommentInput,
} from "@/types/cms";

type CommentsCache = {
  items: CmsBlogComment[];
};

export function useCreateBlogCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCommentInput) => createBlogComment(postId, input),
    onMutate: async (input) => {
      const queryKey = queryKeys.blog.comments(postId);

      await queryClient.cancelQueries({ queryKey });

      const previousComments =
        queryClient.getQueryData<CommentsCache>(queryKey);
      const optimisticComment: CmsBlogComment = {
        id: `optimistic-${Date.now()}`,
        blogPostId: postId,
        parentCommentId: input.parentCommentId,
        commenterName: input.commenterName,
        commentText: input.commentText,
        status: "pending",
        likesCount: 0,
        dislikesCount: 0,
        createdAt: new Date().toISOString(),
        replies: [],
        isOptimistic: true,
      };

      queryClient.setQueryData<CommentsCache>(queryKey, (current) => ({
        items: addOptimisticComment(
          current?.items ?? [],
          optimisticComment,
          input.parentCommentId,
        ),
      }));

      return { previousComments, queryKey };
    },
    onError: (_error, _input, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(context.queryKey, context.previousComments);
      }
    },
    onSettled: (_data, _error, _input, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
}

export function useReactToBlogCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      reactionType,
    }: {
      commentId: string;
      reactionType: CommentReactionInput["reactionType"];
    }) => reactToBlogComment(commentId, { reactionType }),
    onMutate: async ({ commentId, reactionType }) => {
      const queryKey = queryKeys.blog.comments(postId);

      await queryClient.cancelQueries({ queryKey });

      const previousComments =
        queryClient.getQueryData<CommentsCache>(queryKey);

      queryClient.setQueryData<CommentsCache>(queryKey, (current) => ({
        items: updateCommentReaction(current?.items ?? [], commentId, reactionType),
      }));

      return { previousComments, queryKey };
    },
    onError: (_error, _input, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(context.queryKey, context.previousComments);
      }
    },
    onSettled: (_data, _error, _input, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
}

function addOptimisticComment(
  comments: CmsBlogComment[],
  comment: CmsBlogComment,
  parentCommentId: string | null,
): CmsBlogComment[] {
  if (!parentCommentId) {
    return [comment, ...comments];
  }

  return comments.map((currentComment) => {
    if (currentComment.id === parentCommentId) {
      return {
        ...currentComment,
        replies: [...currentComment.replies, comment],
      };
    }

    return {
      ...currentComment,
      replies: addOptimisticComment(
        currentComment.replies,
        comment,
        parentCommentId,
      ),
    };
  });
}

function updateCommentReaction(
  comments: CmsBlogComment[],
  commentId: string,
  reactionType: CommentReactionInput["reactionType"],
): CmsBlogComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return {
        ...comment,
        likesCount:
          reactionType === "like" ? comment.likesCount + 1 : comment.likesCount,
        dislikesCount:
          reactionType === "dislike"
            ? comment.dislikesCount + 1
            : comment.dislikesCount,
      };
    }

    return {
      ...comment,
      replies: updateCommentReaction(comment.replies, commentId, reactionType),
    };
  });
}
