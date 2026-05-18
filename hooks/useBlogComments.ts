"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { getBlogComments } from "@/services/blogCommentsService";
import { toBlogComment } from "@/types/cms";
import {
  readBlogCommentUserName,
  type BlogCommentReaction,
  writeBlogCommentUserName,
} from "@/utils/blogCommentStorage";
import {
  useCreateBlogCommentMutation,
  useReactToBlogCommentMutation,
} from "@/hooks/useBlogCommentMutations";
import type { BlogComment } from "@/constants/blogCommentsData";

const DEFAULT_VISIBLE_REPLY_COUNT = 1;
const REPLY_BATCH_SIZE = 5;

function countComments(comments: BlogComment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countComments(comment.replies),
    0,
  );
}

export function useBlogComments(postId?: string | null) {
  const resolvedPostId = postId ?? "";
  const [userName, setUserName] = useState(() => readBlogCommentUserName());
  const [expandedReplies, setExpandedReplies] = useState<Record<string, number>>(
    {},
  );
  const [reactions, setReactions] = useState<Record<string, BlogCommentReaction>>(
    {},
  );
  const commentsQuery = useQuery({
    enabled: Boolean(postId),
    queryKey: queryKeys.blog.comments(resolvedPostId),
    queryFn: () => getBlogComments(resolvedPostId),
    select: (data) => data.items.map(toBlogComment),
  });
  const createCommentMutation = useCreateBlogCommentMutation(resolvedPostId);
  const reactionMutation = useReactToBlogCommentMutation(resolvedPostId);

  const comments = useMemo(() => commentsQuery.data ?? [], [commentsQuery.data]);
  const totalCommentCount = useMemo(() => countComments(comments), [comments]);

  const saveUserName = useCallback((nextUserName: string) => {
    const trimmedName = nextUserName.trim();

    if (!trimmedName) {
      return;
    }

    writeBlogCommentUserName(trimmedName);
    setUserName(trimmedName);
  }, []);

  const addComment = useCallback(
    (body: string, author: string) => {
      const trimmedBody = body.trim();

      if (!trimmedBody || !resolvedPostId) {
        return;
      }

      createCommentMutation.mutate({
        parentCommentId: null,
        commenterName: author,
        commentText: trimmedBody,
      });
    },
    [createCommentMutation, resolvedPostId],
  );

  const addReply = useCallback(
    (commentId: string, body: string, author: string) => {
      const trimmedBody = body.trim();

      if (!trimmedBody || !resolvedPostId) {
        return;
      }

      createCommentMutation.mutate({
        parentCommentId: commentId,
        commenterName: author,
        commentText: trimmedBody,
      });

      setExpandedReplies((currentCounts) => ({
        ...currentCounts,
        [commentId]:
          (currentCounts[commentId] ?? DEFAULT_VISIBLE_REPLY_COUNT) + 1,
      }));
    },
    [createCommentMutation, resolvedPostId],
  );

  const toggleReaction = useCallback(
    (commentId: string, reaction: BlogCommentReaction) => {
      if (!resolvedPostId) {
        return;
      }

      setReactions((currentReactions) => {
        const currentReaction = currentReactions[commentId];
        const nextReactions = { ...currentReactions };

        if (currentReaction === reaction) {
          delete nextReactions[commentId];
        } else {
          nextReactions[commentId] = reaction;
        }

        return nextReactions;
      });

      reactionMutation.mutate({ commentId, reactionType: reaction });
    },
    [reactionMutation, resolvedPostId],
  );

  const expandMoreReplies = useCallback((commentId: string, replyCount: number) => {
    setExpandedReplies((currentCounts) => {
      const currentCount = currentCounts[commentId] ?? DEFAULT_VISIBLE_REPLY_COUNT;

      return {
        ...currentCounts,
        [commentId]: Math.min(currentCount + REPLY_BATCH_SIZE, replyCount),
      };
    });
  }, []);

  const collapseReplies = useCallback((commentId: string) => {
    setExpandedReplies((currentCounts) => ({
      ...currentCounts,
      [commentId]: DEFAULT_VISIBLE_REPLY_COUNT,
    }));
  }, []);

  const getVisibleReplyCount = useCallback(
    (commentId: string) =>
      expandedReplies[commentId] ?? DEFAULT_VISIBLE_REPLY_COUNT,
    [expandedReplies],
  );

  return {
    addComment,
    addReply,
    collapseReplies,
    comments,
    commentsError: commentsQuery.error,
    expandMoreReplies,
    getVisibleReplyCount,
    isCommentsError: commentsQuery.isError,
    isCommentsLoading: commentsQuery.isLoading,
    isCommentSubmitting: createCommentMutation.isPending,
    isReactionSubmitting: reactionMutation.isPending,
    reactions,
    refetchComments: commentsQuery.refetch,
    saveUserName,
    toggleDislike: (commentId: string) => toggleReaction(commentId, "dislike"),
    toggleLike: (commentId: string) => toggleReaction(commentId, "like"),
    totalCommentCount,
    userName,
  };
}
