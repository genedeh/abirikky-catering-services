"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  blogCommentsBySlug,
  type BlogComment,
} from "@/constants/blogCommentsData";
import {
  readBlogCommentUserName,
  type BlogCommentReaction,
  writeBlogCommentUserName,
} from "@/utils/blogCommentStorage";

const DEFAULT_VISIBLE_REPLY_COUNT = 1;
const REPLY_BATCH_SIZE = 5;

type RuntimeBlogCommentsState = {
  reactions: Record<string, BlogCommentReaction>;
  userComments: BlogComment[];
  userRepliesByParent: Record<string, BlogComment[]>;
};

const createInitialCommentsState = (): RuntimeBlogCommentsState => ({
  reactions: {},
  userComments: [],
  userRepliesByParent: {},
});

function countComments(comments: BlogComment[]) {
  return comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0,
  );
}

function mergeUserReplies(
  comments: BlogComment[],
  userRepliesByParent: Record<string, BlogComment[]> = {},
): BlogComment[] {
  return comments.map((comment) => ({
    ...comment,
    replies: [
      ...mergeUserReplies(comment.replies, userRepliesByParent),
      ...(userRepliesByParent[comment.id] ?? []),
    ],
  }));
}

export function useBlogComments(postSlug: string) {
  const [commentsState, setCommentsState] = useState<RuntimeBlogCommentsState>(
    createInitialCommentsState,
  );
  const [userName, setUserName] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    setUserName(readBlogCommentUserName());
  }, []);

  useEffect(() => {
    setCommentsState(createInitialCommentsState());
    setExpandedReplies({});
  }, [postSlug]);

  const comments = useMemo(
    () =>
      mergeUserReplies(
        [
          ...commentsState.userComments,
          ...(blogCommentsBySlug[postSlug] ?? []),
        ],
        commentsState.userRepliesByParent,
      ),
    [postSlug, commentsState.userComments, commentsState.userRepliesByParent],
  );

  const totalCommentCount = useMemo(() => countComments(comments), [comments]);

  const updateCommentsState = useCallback(
    (
      updater: (
        currentState: RuntimeBlogCommentsState,
      ) => RuntimeBlogCommentsState,
    ) => {
      setCommentsState((currentState) => updater(currentState));
    },
    [],
  );

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

      if (!trimmedBody) {
        return;
      }

      const newComment: BlogComment = {
        id: `${postSlug}-user-comment-${Date.now()}`,
        postSlug,
        author,
        body: trimmedBody,
        createdAtLabel: "a minute ago",
        likes: 0,
        dislikes: 0,
        replies: [],
        isUserComment: true,
      };

      updateCommentsState((currentState) => ({
        ...currentState,
        userComments: [newComment, ...currentState.userComments],
      }));
    },
    [postSlug, updateCommentsState],
  );

  const addReply = useCallback(
    (commentId: string, body: string, author: string) => {
      const trimmedBody = body.trim();

      if (!trimmedBody) {
        return;
      }

      const newReply: BlogComment = {
        id: `${commentId}-user-reply-${Date.now()}`,
        postSlug,
        author,
        body: trimmedBody,
        createdAtLabel: "a minute ago",
        likes: 0,
        dislikes: 0,
        replies: [],
        isUserComment: true,
      };

      updateCommentsState((currentState) => ({
        ...currentState,
        userRepliesByParent: {
          ...currentState.userRepliesByParent,
          [commentId]: [
            ...(currentState.userRepliesByParent[commentId] ?? []),
            newReply,
          ],
        },
      }));

      setExpandedReplies((currentCounts) => ({
        ...currentCounts,
        [commentId]:
          (currentCounts[commentId] ?? DEFAULT_VISIBLE_REPLY_COUNT) + 1,
      }));
    },
    [postSlug, updateCommentsState],
  );

  const toggleReaction = useCallback(
    (commentId: string, reaction: BlogCommentReaction) => {
      updateCommentsState((currentState) => {
        const currentReaction = currentState.reactions[commentId];
        const nextReactions = { ...currentState.reactions };

        if (currentReaction === reaction) {
          delete nextReactions[commentId];
        } else {
          nextReactions[commentId] = reaction;
        }

        return {
          ...currentState,
          reactions: nextReactions,
        };
      });
    },
    [updateCommentsState],
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
    expandMoreReplies,
    getVisibleReplyCount,
    reactions: commentsState.reactions,
    saveUserName,
    toggleDislike: (commentId: string) => toggleReaction(commentId, "dislike"),
    toggleLike: (commentId: string) => toggleReaction(commentId, "like"),
    totalCommentCount,
    userName,
  };
}
